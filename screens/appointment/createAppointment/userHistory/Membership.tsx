import React, { FC, useEffect, useState } from "react";
import { FlatList, Image, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { FontSize, GlobalColors } from "../../../../Styles/GlobalStyleConfigs";
import { GlobalStyles } from "../../../../Styles/Styles";
import moment from "moment";
import { MEMBERSHIPCOLORS, environment } from "../../../../utils/Constants";
import { useAppDispatch, useAppSelector } from "../../../../redux/Hooks";
import { selectBranchId, selectPaymentTypes, selectStaffData, selectTenantId, selectUserData } from "../../../../redux/state/UserStates";
import { makeAPIRequest } from "../../../../utils/Helper";
import { Svg, Path } from "react-native-svg";
import GuestExpertDropdown from "../GuestExpertDropdown";
import LoadingState from "../../../../components/LoadingState";
import { setIsLoading } from "../../../../redux/state/UIStates";
import { Ionicons } from "@expo/vector-icons";
import { MultiSelect } from 'react-native-element-dropdown';
import AddFamilyMemberModal from "../../../../components/AddFamilyMemberModal";
import Toast from "react-native-root-toast";

interface IMembership {
    customer: { [key: string]: any },
    setCustomer: (val: any) => void,
}

const Membership: FC<IMembership> = ({ customer, setCustomer }) => {
    const storeId = useAppSelector(selectBranchId);
    const tenantId = useAppSelector(selectTenantId);
    const staffList = useAppSelector(selectStaffData);
    const paymentTypes = useAppSelector(selectPaymentTypes);
    const loggedInUser = useAppSelector(selectUserData);
    const dispatch = useAppDispatch();

    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [membershipDetails, setMembershipDetails] = useState<{ [key: string]: any }[]>([]);
    const [selectedMembership, setSelectedMembership] = useState<{ [key: string]: any } | null>(null);
    const [validity, setValidity] = useState<string>("");
    const [price, setPrice] = useState<string>("");
    const [expert, setExpert] = useState<{ [key: string]: any }>({});
    const [remark, setRemark] = useState<string>('');
    const [addMember, setAddMember] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedFamily, setSelectedFamily] = useState([]);
    const [secondModal, setSecondModal] = useState<boolean>(false);
    const [payment, setPayment] = useState<{ [key: string]: any }>({});

    const getMemberships = async () => {
        const url = environment.documentBaseUri + `membership/${tenantId}/${storeId}`;
        const response = await makeAPIRequest(url, null, "GET");
        if (response.code == 200) {
            setMembershipDetails(response.data);
        }
        setLoading(false);
    };

    const getPurchasedAmount = () => {
        let amount = selectedMembership?.membershipFee;
        selectedMembership?.txchrgs.map((tax: any, index: number) => {
            amount += tax.isInclusive ? 0 : tax.value
            delete tax.id;
        })
        return amount;
    };

    const paymentSetter = () => {
        let payments: { [key: string]: any }[] = [];
        Object.keys(payment).map((name: string) => {
            if (payment[name] > "0") {
                let obj = {
                    bankTxnId: 0,
                    cardNo: "",
                    createdOn: moment().toISOString(),
                    name: name,
                    payment: parseInt(payment[name]),
                    remark: "",
                    txnId: ""

                }
                payments.push(obj);
            }
        });
        console.log(payments)
        return payments;
    };

    const validateModalData = () => {
        if (!selectedMembership) {
            console.log("eeee")
            Toast.show("Select Membership", { backgroundColor: GlobalColors.error });
            return false;
        }
        if (!price) {
            Toast.show("Enter Price", { backgroundColor: GlobalColors.error });
            return false;
        }
        if (!validity) {
            Toast.show("Enter validity", { backgroundColor: GlobalColors.error });
            return false;
        }
        if (Object.keys(expert).length === 0) {
            Toast.show("Select staff", { backgroundColor: GlobalColors.error });
            return false;
        }
        if (!payment) {
            Toast.show("Please select paymode", { backgroundColor: GlobalColors.error });
            return false;
        }
        return true;
    };

    const addMembershipToUser = async () => {
        const url = environment.guestUrl + `guestmembership`;
        if (validateModalData()) {
            dispatch(setIsLoading({ isLoading: true }));
            const benifitedAmt = selectedMembership?.typeId == 1 ? (Number(selectedMembership.membershipFee) + Number(selectedMembership.benefit)) : 0;
            let dateString = moment().toISOString();
            const toDate = moment().add(Number(selectedMembership?.validity), 'days').toISOString();
            const txnObj = {
                "active": true,
                "balanceAmount": benifitedAmt,
                "benefitAmount": selectedMembership?.typeId == 1 ? selectedMembership.benefit : 0,
                "createdBy": loggedInUser!.id,
                "createdOn": dateString,
                "guestId": customer.id,
                "guestName": customer.firstName,
                "membershipName": selectedMembership?.name,
                "membershipPlanId": selectedMembership?.id,
                "modifiedBy": loggedInUser!.id,
                "modifiedOn": dateString,
                "purchaseAmount": getPurchasedAmount(),
                "remark": remark,
                "fromDate": moment().toISOString(),
                "toDate": toDate,
                "staffId": expert.id,
                "storeId": storeId,
                "tenantId": tenantId,
                "terminatedOn": null,
                "txchrgs": selectedMembership?.txchrgs,
                "membershipFee": selectedMembership?.membershipFee,
                "payments": paymentSetter(),
                'sharedMembers': [], // will be updated for isHsared profiles
                'typeId': selectedMembership?.typeId,
            }
            let response = await makeAPIRequest(url, txnObj, "POST");
            if (response && response.code == 200) {
                setModalVisible(false);
                Toast.show("Membership assigned", { backgroundColor: GlobalColors.success });
            } else {
                Toast.show("Error Encountered", { backgroundColor: GlobalColors.error });
            }
            dispatch(setIsLoading({ isLoading: false }));
        }
    };

    const renderItem = ({ item, index }: any) => {
        return (
            <Pressable key={index} style={{ width: 280, height: '95%', backgroundColor: MEMBERSHIPCOLORS[index % MEMBERSHIPCOLORS.length].shade1, borderRadius: 5, margin: 10, borderColor: GlobalColors.blue, borderWidth: item == selectedMembership ? 1 : 0 }}
                onPress={() => {
                    setSelectedMembership(item);
                    console.log(item)
                    setValidity(item.validity.toString());
                    setPrice(item.membershipFee.toString());
                    setAddMember(item.isSharable);
                }}
            >
                <Svg height={280} width={280} viewBox="0 0 1440 320">
                    <Path
                        fill={MEMBERSHIPCOLORS[index % MEMBERSHIPCOLORS.length].shade2}
                        d="M0,160L48,181.3C96,203,192,245,288,250.7C384,256,480,224,576,192C672,160,768,128,864,106.7C960,85,1056,75,1152,96C1248,117,1344,171,1392,197.3L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                    />
                </Svg>
                <View style={{ position: 'absolute', paddingVertical: 10, paddingHorizontal: 10 }}>
                    <Text style={{ fontSize: FontSize.headingX, marginBottom: 10 }}>{item.name}</Text>
                    <Text style={{ fontWeight: '300', marginBottom: 10 }}>Pay ₹{item.membershipFee} & Get ₹{item.membershipFee + item.benefit}</Text>
                    <View style={[GlobalStyles.justifiedRow, { marginBottom: 10 }]}>
                        <Text style={{ fontWeight: '300', marginRight: 10 }}>Validity: {item.validity} Days</Text>
                        <Text style={{ fontWeight: '300' }}>Benefit: ₹{item.benefit} Extra</Text>
                    </View>
                    {item.txchrgs.length > 0 &&
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ fontWeight: '300' }}>Taxes: </Text>
                            {item.txchrgs.map((tax: any, index: number) => (
                                <Text key={index} style={{ fontWeight: '300' }}>₹{tax.value} {tax.isInclusive && `(Inclusive)`}</Text>
                            ))}
                        </View>}
                    <View style={{ marginTop: 10, borderColor: MEMBERSHIPCOLORS[index % MEMBERSHIPCOLORS.length].shade3, borderWidth: 1, width: '55%', borderRadius: 5 }}>
                        <Text style={{ fontSize: FontSize.heading, padding: 5, textAlign: 'center' }}>Fee ₹{item.membershipFee}</Text>
                    </View>
                </View>
            </Pressable>
        );
    }

    useEffect(() => {
        if (modalVisible) {
            setSelectedMembership(null);
            setValidity("");
            setPrice("");
            setPayment({});
            getMemberships();
        }
    }, [modalVisible]);

    useEffect(()=>{
        setPayment({});
    }, [price, validity])

    return (
        <View style={{ width: '100%', flex: 1, paddingVertical: 20, paddingHorizontal: 10 }}>
            <View style={{ justifyContent: 'flex-end', flexDirection: 'row', marginBottom: 15 }}>
                <TouchableOpacity style={{ backgroundColor: GlobalColors.blue, borderRadius: 5 }}
                    onPress={() => { setModalVisible(true) }}
                >
                    <Text style={{ color: "#fff", padding: 10, fontSize: FontSize.medium }}>Assign Membership</Text>
                </TouchableOpacity>
            </View>
            <Text style={{ fontSize: FontSize.medium, fontWeight: '500', marginBottom: 10 }}>Membership History</Text>
            {
                customer.membershipHistory ?
                    <View style={[GlobalStyles.cardView, GlobalStyles.shadow]}>
                        <View style={[GlobalStyles.justifiedRow, { padding: 10, backgroundColor: 'lightgray', borderRadius: 5, marginBottom: 5 }]}>
                            <Text style={{ width: '40%' }}>Name</Text>
                            <Text>Start Date</Text>
                            <Text>End Date</Text>
                        </View>
                        <ScrollView>
                            {
                                customer.membershipHistory.map((membership: any, index: number) => (
                                    <View key={index} style={[GlobalStyles.justifiedRow, { paddingHorizontal: 10, paddingVertical: 10, borderBottomWidth: 0.5, borderColor: 'gray' }]}>
                                        <Text style={{ width: '40%' }}>{membership.membershipPlan}</Text>
                                        <Text>{moment(membership.purchaseDate).format('YYYY-MM-DD')}</Text>
                                        <Text>{moment(membership.expiryDate).format('YYYY-MM-DD')}</Text>
                                    </View>
                                ))
                            }
                        </ScrollView>
                    </View>
                    :
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ fontSize: FontSize.medium }}>No History yet</Text>
                    </View>
            }
            <Modal
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}>
                {
                    secondModal && <AddFamilyMemberModal modalVisible={secondModal} setModalVisible={setSecondModal} customer={customer} setCustomer={setCustomer}/>
                }
                <View style={[GlobalStyles.modalbackground]}>
                    <View style={styles.modalView}>
                        {loading ?
                            <LoadingState loader={loading} />
                            : <>
                                <Text style={styles.heading}>Add Membership</Text>
                                <ScrollView>
                                    <FlatList
                                        data={membershipDetails}
                                        renderItem={renderItem}
                                        keyExtractor={(item, index) => index.toString()}
                                        style={{ maxHeight: '30%' }}
                                        horizontal
                                    />
                                    <View style={{ paddingHorizontal: 10, width: '100%', marginVertical: 10 }}>
                                        <View style={{ borderTopWidth: 1, borderBottomWidth: 1, borderColor: 'lightgray', padding: 10, marginBottom: 10 }}>
                                            <Text style={{ fontSize: FontSize.heading, fontWeight: '500' }}>Advance: {customer.advanceAmount}</Text>
                                        </View>
                                        <View style={GlobalStyles.justifiedRow}>
                                            <View style={{ width: '45%' }}>
                                                <Text style={{ fontSize: FontSize.medium }}>Validity (Days)</Text>
                                                <TextInput
                                                    style={styles.textInput}
                                                    value={validity}
                                                    placeholderTextColor="gray"
                                                    underlineColorAndroid="transparent"
                                                    onChangeText={(val) => {
                                                        setValidity(val);
                                                    }}
                                                />
                                            </View>
                                            <View style={{ width: '45%' }}>
                                                <Text style={{ fontSize: FontSize.medium }}>Price</Text>
                                                <TextInput
                                                    style={styles.textInput}
                                                    value={price}
                                                    placeholderTextColor="gray"
                                                    underlineColorAndroid="transparent"
                                                    onChangeText={(val) => {
                                                        setPrice(val);
                                                    }}
                                                />
                                            </View>
                                        </View>
                                        <View style={{ marginVertical: 15 }}>
                                            <Text style={{ fontSize: FontSize.medium }}>Staff</Text>
                                            <GuestExpertDropdown data={staffList!} placeholderText="Select Staff" type="expert" selectedValue={expert.name} setSelected={setExpert} />
                                        </View>
                                        {addMember &&
                                            <View style={{ marginBottom: 15, width: '100%', alignSelf: 'center', borderWidth: 0.5, padding: 10, borderColor: 'lightgray', borderRadius: 2 }}>
                                                <View style={GlobalStyles.justifiedRow}>
                                                    <Text style={{ fontSize: FontSize.medium, width: '70%', fontWeight: '500' }}>Add Family Members To Share Membership</Text>
                                                    <TouchableOpacity style={{ backgroundColor: GlobalColors.blue, padding: 5, borderRadius: 20 }}
                                                        onPress={() => { setSecondModal(true) }}
                                                    >
                                                        <Ionicons name="add" size={20} color="#fff" />
                                                    </TouchableOpacity>
                                                </View>
                                                <View style={[{ marginTop: 10 }]}>
                                                    <View style={styles.container}>
                                                        <MultiSelect
                                                            style={styles.dropdown}
                                                            data={customer.familyMembers ?? []}
                                                            labelField="name"
                                                            valueField="name"
                                                            placeholder="Select Member"
                                                            value={selectedFamily}
                                                            onChange={item => {
                                                                setSelectedFamily(item);
                                                            }}
                                                            selectedTextStyle={{ color: '#000' }}
                                                            selectedStyle={styles.selectedStyle}
                                                            placeholderStyle={{ color: 'gray' }}
                                                            iconColor={GlobalColors.blue}
                                                        />
                                                    </View>
                                                </View>
                                            </View>
                                        }
                                        <View>
                                            <Text style={{ fontSize: FontSize.large, marginBottom: 10 }}>Payment Details:</Text>
                                            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 15 }}>
                                                {paymentTypes?.map((type: { [key: string]: any }, index: number) => (
                                                    <Pressable style={{ margin: 10, width: '25%' }} key={index}
                                                        onPress={() => {
                                                            const total = Object.values(payment).reduce((acc, curr) => acc + parseInt(curr), 0);
                                                            if (price && total < parseInt(price)) {
                                                                setPayment(prev => ({
                                                                    ...prev,
                                                                    [type.name]: (parseInt(price) - total).toString()
                                                                }))
                                                            }
                                                        }}
                                                    >
                                                        <Text>{type.name}</Text>
                                                        <View style={[{ borderWidth: 0.5, borderColor: 'lightgray', borderRadius: 2, padding: 3, marginVertical: 5, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly' }]}>
                                                            <Image source={{ uri: type.img }} style={{ width: 25, height: 25 }} />
                                                            <TextInput
                                                                value={payment[type.name]}
                                                                style={{ borderBottomWidth: 0.5, width: '50%', borderColor: 'gray' }}
                                                                onChangeText={(val) => {
                                                                    let temp = { ...payment };
                                                                    temp[type.name] = val
                                                                    const total = Object.values(temp).reduce((acc, curr) => acc + parseInt(curr), 0);
                                                                    console.log(temp, payment, total, parseInt(price))
                                                                    if (total < parseInt(price)) {
                                                                        payment[type.name] = val
                                                                    }
                                                                }}//bug in textField
                                                                editable={price != "" && (Object.values(payment).reduce((acc, curr) => acc + parseInt(curr), 0) < parseInt(price) || payment[type.name])}
                                                            />
                                                        </View>
                                                    </Pressable>
                                                ))}
                                            </View>
                                            <View>
                                                <Text style={{ fontSize: FontSize.large, marginBottom: 10 }}>Remark:</Text>
                                                <TextInput
                                                    style={styles.textInput}
                                                    placeholder="Enter Remark"
                                                    value={remark}
                                                    onChangeText={setRemark}
                                                />
                                            </View>
                                        </View>
                                    </View>
                                </ScrollView>
                                <View style={[GlobalStyles.justifiedRow, { justifyContent: "flex-end", width: "100%", paddingTop: 15, borderTopColor: 'lightgray', borderTopWidth: 2 }]}>
                                    <Pressable style={[styles.buttonContainer, { marginRight: 20, width: '30%' }]}
                                        onPress={() => { setModalVisible(false) }}
                                    >
                                        <Text style={styles.buttonText}>Cancel</Text>
                                    </Pressable>
                                    <Pressable style={[styles.buttonContainer, { backgroundColor: GlobalColors.blue, marginRight: 20, width: '40%' }]}
                                        onPress={async () => {
                                            await addMembershipToUser();
                                        }}
                                    >
                                        <Text style={[styles.buttonText, { color: '#fff' }]}>Add Membership</Text>
                                    </Pressable>
                                </View>
                            </>
                        }
                    </View>
                </View>
            </Modal>

        </View>
    );
};

const styles = StyleSheet.create({
    modalView: {
        width: '95%',
        margin: 5,
        backgroundColor: '#fff',
        borderRadius: 5,
        paddingVertical: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 2,
        shadowRadius: 5,
        elevation: 5,
        height: '88%'
    },
    heading: {
        fontSize: FontSize.headingX,
        fontWeight: '500',
        marginBottom: 20,
        color: GlobalColors.blue
    },
    textInput: {
        paddingHorizontal: 10,
        paddingVertical: 10,
        marginVertical: 5,
        borderWidth: 0.5,
        borderColor: 'lightgray',
        borderRadius: 2,
    },
    buttonContainer: {
        borderWidth: 1,
        borderColor: GlobalColors.blue,
        borderRadius: 5,
    },
    buttonText: {
        fontSize: FontSize.large,
        textAlign: "center",
        paddingVertical: 5,
        color: GlobalColors.blue
    },
    container: { width: '100%' },
    dropdown: {
        width: '60%',
        backgroundColor: 'transparent',
        borderColor: 'lightgray',
        borderWidth: 0.5,
        borderRadius: 5,
        paddingHorizontal: 5,
        marginBottom: 5
    },
    selectedStyle: {
        borderRadius: 15,
        backgroundColor: GlobalColors.lightGray2,
        borderColor: '#fff'
    },
});

export default Membership;