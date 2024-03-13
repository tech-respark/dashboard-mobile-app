import React, { FC, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { FontSize, GlobalColors } from "../../../Styles/GlobalStyleConfigs";
import { GlobalStyles } from "../../../Styles/Styles";
import { Ionicons } from "@expo/vector-icons";
import { environment } from "../../../utils/Constants";
import { makeAPIRequest } from "../../../utils/Helper";
import Toast from "react-native-root-toast";
import AddFamilyMemberModal from "../common/AddFamilyMemberModal";

interface IFamilyMembers {
    customer: { [key: string]: any },
    setCustomer: (val: any) => void,
}

const FamilyMembers: FC<IFamilyMembers> = ({ customer, setCustomer }) => {
    const [modalVisible, setModalVisible] = useState<boolean>(false);

    const deleteMember = async (index: number) => {
        customer.familyMembers.splice(index, 1);
        let url = environment.guestUrl + `familyMembers?guestId=${customer.id}`;
        let response = await makeAPIRequest(url, customer.familyMembers, "PUT");
        if (response) {
            Toast.show("Member Deleted", { backgroundColor: GlobalColors.success });
            setCustomer(response);
        }
    };

    return (
        <View style={{ width: '100%', paddingVertical: 20, paddingHorizontal: 10 }}>
            {modalVisible && <AddFamilyMemberModal modalVisible={modalVisible} setModalVisible={setModalVisible} customer={customer} setCustomer={setCustomer} />}
            <View style={{ justifyContent: 'flex-end', flexDirection: 'row', marginBottom: 15 }}>
                <TouchableOpacity style={{ backgroundColor: GlobalColors.blue, borderRadius: 5 }}
                    onPress={() => { setModalVisible(true) }}
                >
                    <Text style={{ color: "#fff", padding: 10, fontSize: FontSize.medium }}>Add Member</Text>
                </TouchableOpacity>
            </View>
            <Text style={{ fontSize: FontSize.medium, fontWeight: '500', marginBottom: 10 }}>Family Members</Text>
            {
                customer.familyMembers ?
                    <ScrollView style={[GlobalStyles.cardView, GlobalStyles.shadow]}>
                        {customer.familyMembers.map((member: any, index: number) => (
                            <View key={index} style={[GlobalStyles.justifiedRow, styles.memberView]}>
                                <View style={styles.textView}>
                                    <Text style={{ marginRight: 5 }}>{index + 1}.</Text>
                                    <Text style={{ fontWeight: '500' }}>{member.name}, </Text>
                                    <Text>{member.mobileNo}</Text>
                                </View>
                                <TouchableOpacity style={styles.iconView}
                                    onPress={() => { deleteMember(index) }}
                                >
                                    <Ionicons name="close" size={20} color={'red'} />
                                </TouchableOpacity>
                            </View>
                        ))}
                    </ScrollView> :
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ fontSize: FontSize.medium }}>No Family members added yet</Text>
                    </View>
            }
        </View>
    );
};

const styles = StyleSheet.create({
    memberView: {
        paddingVertical: 10,
        borderBottomWidth: 0.5,
        borderColor: 'lightgray',
        width: '95%',
        alignSelf: 'center'
    },
    textView: {
        width: '80%',
        flexDirection: 'row'
    },
    iconView: {
        borderRadius: 20,
        borderWidth: 0.5,
        alignItems: 'center',
        padding: 2,
        borderColor: 'gray'
    }
});

export default FamilyMembers;