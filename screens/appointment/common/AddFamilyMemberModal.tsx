import React, { FC, useEffect, useState } from "react";
import { Modal, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { GlobalStyles } from "../../../Styles/Styles";
import { FontSize, GlobalColors } from "../../../Styles/GlobalStyleConfigs";
import GuestExpertDropdown from "../createAppointment/GuestExpertDropdown";
import { useCustomerData } from "../../../customHooks/AppointmentHooks";
import AddUpdateUser from "./AddUpdateUser";
import { environment } from "../../../utils/Constants";
import { makeAPIRequest } from "../../../utils/Helper";
import Toast from "react-native-root-toast";
import { useIsFocused } from "@react-navigation/native";

interface IAddFamilyMemberModal {
    modalVisible: boolean,
    setModalVisible: (val: boolean) => void,
    customer: { [key: string]: any },
    setCustomer: (val: any) => void,
};

const AddFamilyMemberModal: FC<IAddFamilyMemberModal> = ({ modalVisible, setModalVisible, customer, setCustomer }) => {
    const [selectedCustomer, setSelectedCustomer] = useState<{ [key: string]: any }>({});
    const [createUserModal, setCreateUserModal] = useState<boolean>(false);
    const [relation, setRelation] = useState<string>("");
    const [updatedGuests, setUpdatedGuests] =  useState<{[key: string]: any}[]>([]);
    const [showError, setShowError] = useState<boolean>(false);
    const guests = useCustomerData(createUserModal);

    const addMember = async () => {
        if(!relation){
            setShowError(true);
            return
        };
        let members = customer.familyMembers ?? [];
        members.push({
                id: selectedCustomer.id,
                mobileNo: selectedCustomer.mobileNo,
                name: selectedCustomer.firstName,
                optInForWapp: false,
                relation: relation
            });
        let tempCus = {...customer, ...{familyMembers: members}};
        let url = environment.guestUrl + `customers`;
        let response = await makeAPIRequest(url, tempCus, "POST");
        if (response) {
            setCustomer(response);
            setModalVisible(false);
            Toast.show("Member Added", { backgroundColor: GlobalColors.success });
        }
    };

    useEffect(()=>{
        if(guests.length > 0){
            setUpdatedGuests(guests.filter(guest => !customer.familyMembers?.some((item2: any) => guest.id === item2.id) && guest.id !== customer.id));
        }
    }, [guests]);

    return (
        <Modal
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
                setModalVisible(!modalVisible);
            }}>
            {createUserModal && <AddUpdateUser setModalVisible={setCreateUserModal} modalVisible={createUserModal} />}
            <View style={[GlobalStyles.modalbackground]}>
                <View style={styles.modalView}>
                    <Text style={{ width: '100%', textAlign: 'center', fontWeight: '600', fontSize: FontSize.large }}>Add Family Member</Text>
                    <View style={{ width: '100%', backgroundColor: 'lightgray', height: 1, marginVertical: 10 }} />
                    <View style={{ marginBottom: 10 }}>
                        <Text>Customer </Text>
                        <GuestExpertDropdown data={updatedGuests} placeholderText="Search By Name Or Number" type="guest" setSelected={(val) => { setSelectedCustomer(val) }} selectedValue={selectedCustomer.firstName} />
                    </View>
                    <View style={{ marginBottom: 10 }}>
                        <Text>Relation*</Text>
                        <TextInput
                            style={styles.textInput}
                            placeholder="Mother, Father, etc..."
                            value={relation}
                            placeholderTextColor="lightgray"
                            onChangeText={setRelation}
                        />
                        {showError && <Text style={{fontSize: FontSize.small, color: GlobalColors.error}}>Please enter relation</Text>}
                    </View>
                    <View style={[GlobalStyles.justifiedRow, { justifyContent: "flex-end", width: "100%", paddingTop: 15, borderTopColor: 'lightgray', borderTopWidth: 2 }]}>
                        <Pressable style={[styles.buttonContainer, { marginRight: 20, width: '30%' }]}
                            onPress={() => { setModalVisible(false) }}
                        >
                            <Text style={styles.buttonText}>Cancel</Text>
                        </Pressable>
                        <Pressable style={[styles.buttonContainer, { backgroundColor: GlobalColors.blue, paddingHorizontal: 10 }]}
                            onPress={async () => {
                                if (Object.keys(selectedCustomer).length > 0) {
                                    addMember()
                                } else {
                                    setCreateUserModal(true);
                                }
                            }}
                        >
                            <Text style={[styles.buttonText, { color: '#fff' }]}>{Object.keys(selectedCustomer).length > 0 ? "Add Member" : "+ Add Customer"}</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </Modal>
    );

};

const styles = StyleSheet.create({
    modalView: {
        width: '80%',
        backgroundColor: '#fff',
        paddingVertical: 20,
        paddingHorizontal: 20,
        borderRadius: 5
    },
    textInput: {
        backgroundColor: GlobalColors.lightGray2,
        borderWidth: 0.5,
        borderColor: 'lightgray',
        paddingHorizontal: 10,
        paddingVertical: 5,
        marginVertical: 10
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
});

export default AddFamilyMemberModal;