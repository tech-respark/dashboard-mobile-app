import React, { FC, useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { GlobalStyles } from "../../../../../Styles/Styles";
import moment from "moment";
import { FontSize, GlobalColors } from "../../../../../Styles/GlobalStyleConfigs";
import { TextInput, TouchableOpacity } from "react-native-gesture-handler";
import AddMemberView from "./AddMemberView";
import { SHOW_SHIFT_MEMBERSHIP_AFTER_DAYS, environment } from "../../../../../utils/Constants";
import { Ionicons } from "@expo/vector-icons";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { selectUserData } from "../../../../../redux/state/UserStates";
import { useAppSelector } from "../../../../../redux/Hooks";
import { getAddedMembersObjects, makeAPIRequest } from "../../../../../utils/Helper";
import Toast from "react-native-root-toast";
import FamilyMembers from "../FamilyMembers";
import AlertModal from "../../../../../components/AlertModal";

interface IShiftMembership {
    customer: { [key: string]: any },
    setCustomer: (val: any) => void,
}
const ShiftMembership: FC<IShiftMembership> = ({ customer, setCustomer }) => {
    const loggedInUser = useAppSelector(selectUserData);

    const [selectedFamily, setSelectedFamily] = useState<string[]>([]);
    const [daysRemaining, setDaysRemaining] = useState<number | null>(null);
    const [amount, setAmount] = useState<string>("");
    const [remark, setRemark] = useState<string>("");
    const [expiryDate, setExpiryDate] = useState<string>("");
    const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
    const [showError, setShowError] = useState<boolean>(false);
    const [showModal, setShowModal] = useState<boolean>(false);

    let isEditable = true

    const calculateDaysRemaining = () => {
        const daysDifference = moment(customer.membership.toDate).diff(moment(), 'days');
        setDaysRemaining(daysDifference);
    };

    const updateMembership = async () => {
        if(!remark){
            setShowError(true);
            return
        }
        const url = environment.guestUrl + `updateGuestMembership?guestId=${customer.id}&membershipPlanId=${customer.membership.membershipPlanId}`;
        let data = {
            balanceAmount: parseInt(amount),
            balanceMinutes: null,
            editRemark: remark,
            modifiedBy: loggedInUser!.id,
            newSharedMembers: getAddedMembersObjects(selectedFamily, customer),
            toDate: expiryDate
        }
        const response = await makeAPIRequest(url, data, "PUT");
        if (response && response.code == 200) {
            Toast.show("Membership Updated", { backgroundColor: GlobalColors.success, opacity: 1.0 });
        } else {
            Toast.show("Encountered Error", { backgroundColor: GlobalColors.error, opacity:1.0 });
        }
    };

    const deleteMembership = async() => {
        const url = environment.guestUrl+`guestMembership?id=${customer.membership.guestMembershipId}`;
        let response = await makeAPIRequest(url, null, "DELETE");
        if(response && response.code === 200){
            let tempCus = {...customer, ...{membership: null}};
            setCustomer(tempCus);
            Toast.show("Membership Deleted Successfully", { backgroundColor: GlobalColors.success, opacity: 1.0 });
        }else{
            Toast.show("Encountered Error", { backgroundColor: GlobalColors.error, opacity: 1.0 });
        }
    };

    useEffect(() => {
        calculateDaysRemaining();
        if (isEditable) {
            setAmount(customer.membership.balanceAmount.toString());
            setExpiryDate(customer.membership.toDate);
            if (customer.membership.sharedMembers.length > 0) {
                let temp: string[] = [];
                customer.membership.sharedMembers.map((member: any, index: number) => {
                    temp.push(member.name);
                })
                setSelectedFamily(temp);
            }
        }
    }, []);

    return (
        <View style={[GlobalStyles.cardView, GlobalStyles.shadow, { paddingHorizontal: 10 }]}>
            {showModal && <AlertModal modalVisible={showModal} setModalVisible={setShowModal} heading="Delete Membership" description="Are you sure, you want to delete this Membership ?" onConfirm={() => {deleteMembership()}}/>}
            {isEditable &&
                <View style={{ width: '100%', justifyContent: 'flex-end', flexDirection: 'row' }}>
                    <Ionicons name="trash" color={GlobalColors.error} size={20} style={{ backgroundColor: GlobalColors.lightGray2, padding: 2 }} onPress={() => {
                        setShowModal(true)
                    }} />
                </View>}

            <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 5 }}>
                <Text style={{ fontWeight: '500', marginRight: 10 }}>Membership Id:</Text>
                <Text>{customer.membership.membershipCode}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 5 }}>
                <Text style={{ fontWeight: '500', marginRight: 10 }}>Active Membership:</Text>
                <Text>{customer.membership.membershipName}</Text>
            </View>
            <View style={{ marginBottom: 5 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 5 }}>
                    <Text style={{ fontWeight: '500', marginRight: 10 }}>Expiry Date:</Text>
                    {isEditable ?
                        <Pressable style={[styles.textInput, { width: '30%' }]} onPress={() => { setShowDatePicker(true) }}>
                            <DateTimePickerModal
                                isVisible={showDatePicker}
                                mode="date"
                                onConfirm={(date) => {
                                    setExpiryDate(moment(date).toISOString());
                                    setShowDatePicker(false);
                                }}
                                onCancel={() => setShowDatePicker(false)}
                            />
                            <Text>{moment(expiryDate).format('DD/MM/YYYY')}</Text>
                        </Pressable> :
                        <Text>{moment(customer.membership.toDate).format('YYYY-MM-DD')}</Text>
                    }
                    {/* For Remaining hours */}
                </View>
                {daysRemaining! <= SHOW_SHIFT_MEMBERSHIP_AFTER_DAYS &&
                    <Text style={{ color: GlobalColors.error, fontSize: FontSize.small }}>Expires in {daysRemaining} days</Text>
                }
            </View>
            {customer.membership.balanceAmount > 0 &&
                <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 5 }}>
                    <Text style={{ fontWeight: '500', marginRight: 10 }}>Balance Amount:</Text>
                    {isEditable ?
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text>₹</Text>
                            <TextInput
                                style={styles.textInput}
                                value={amount}
                                underlineColorAndroid="transparent"
                                onChangeText={(val) => {
                                    setAmount(val);
                                }}
                            />
                        </View> :
                        <Text>₹{customer.membership.balanceAmount}</Text>}
                </View>}

            {isEditable &&
                <>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 5 }}>
                        <Text style={{ fontWeight: '500' }}>Remark</Text>
                        <Text style={{ fontWeight: '500', marginRight: 10, color: GlobalColors.error }}>*</Text>
                        <TextInput
                            style={[styles.textInput, { width: '45%' }]}
                            value={remark}
                            underlineColorAndroid="transparent"
                            onChangeText={(val) => {
                                setRemark(val);
                            }}
                        />
                    </View>
                    {showError && <Text style={{ fontSize: FontSize.small, color: GlobalColors.error }}>Please enter remark</Text>}
                </>
            }

            {
                isEditable && customer.membership.isSharable ?
                    <View style={{ marginTop: 10 }}>
                        <AddMemberView customer={customer} setCustomer={setCustomer} selectedFamily={selectedFamily} setSelectedFamily={setSelectedFamily} />
                    </View>
                    :
                    (!isEditable && customer.membership.isSharable) &&
                    <View style={{ borderWidth: 0.5, borderColor: 'lightgray', borderRadius: 2, padding: 10, marginTop: 10 }}>
                        <Text style={{ fontWeight: '500', marginBottom: 5 }}>Family Members</Text>
                        {customer.membership.sharedMembers.length > 0 ?
                            <View>
                                {customer.membership.sharedMembers.map((member: any, index: number) => (
                                    <Text style={{ marginBottom: 5 }} key={index}>{index + 1}. {member.name}</Text>
                                ))}
                            </View> : <Text>No Family Members added</Text>
                        }
                    </View>
            }

            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.buttonView}
                    onPress={() => { }}
                >
                    <Text style={styles.buttonText}>Shift Membership</Text>
                </TouchableOpacity>
                {
                    isEditable &&
                    <TouchableOpacity style={[styles.buttonView, { marginLeft: 15 }]}
                        onPress={async () => { updateMembership() }}>
                        <Text style={styles.buttonText}>Update</Text>
                    </TouchableOpacity>
                }
            </View>

        </View>
    );
};

const styles = StyleSheet.create({
    buttonView: {
        backgroundColor: GlobalColors.blue,
        padding: 10,
        borderRadius: 5,
    },
    buttonText: {
        color: '#fff',
        fontWeight: '500'
    },
    buttonContainer:
    {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        borderTopWidth: 1,
        borderColor: 'lightgray',
        padding: 10,
        marginTop: 10
    },
    textInput: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderWidth: 0.5,
        borderRadius: 2,
        borderColor: 'gray',
        width: '50%',
        marginHorizontal: 5
    },

});

export default ShiftMembership;