import { Ionicons } from "@expo/vector-icons";
import React, { FC, useState } from "react";
import { Modal, Text, View, TouchableOpacity, StyleSheet, TextInput } from "react-native";
import { FontSize, GlobalColors } from "../../../Styles/GlobalStyleConfigs";
import { GlobalStyles } from "../../../Styles/Styles";
import { environment } from "../../../utils/Constants";
import { useAppSelector } from "../../../redux/Hooks";
import { selectBranchId, selectTenantId } from "../../../redux/state/UserStates";
import { makeAPIRequest } from "../../../utils/Helper";
import Toast from "react-native-root-toast";

interface IMembershipValidationModal {
    modalVisible: boolean,
    setModalVisible: (val: boolean) => void,
    setCustomer: (val: {[key: string]: any}) => void,
}
const MembershipValidationModal: FC<IMembershipValidationModal> = ({ modalVisible, setModalVisible, setCustomer }) => {
    const storeId = useAppSelector(selectBranchId);
    const tenantId = useAppSelector(selectTenantId);
    const[membershipId, setMembershipId] = useState<string>(""); 
    const [error, setError] = useState<boolean>(false);

    const validateCheckMembership = async() => {
        const url = environment.guestUrl + `membership/MemCodeValidation?membershipCode=${membershipId}&tenantId=${tenantId}&storeId=${storeId}`;
        let response = await makeAPIRequest(url, null, "GET");
        if (response && response.code == 200){
                setCustomer(response.data);
                setModalVisible(false);
        }else{
            Toast.show("Invalid Membership", {backgroundColor: GlobalColors.error, opacity: 1.0});
            setError(true);
        }
    };

    return (
        <Modal
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
                setModalVisible(!modalVisible);
            }}>
            <View style={[GlobalStyles.modalbackground]}>
                <View style={styles.modalView}>
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                        <TouchableOpacity style={{ backgroundColor: GlobalColors.lightGray2, padding: 3, borderRadius: 20 }}
                            onPress={() => { setModalVisible(false) }}>
                            <Ionicons name="close" size={20} color={GlobalColors.error} />
                        </TouchableOpacity>
                    </View>
                    <Text style={{ textAlign: 'center', fontWeight: '500', fontSize: FontSize.heading }}>Membership Validation</Text>
                    <View style={{ width: '100%', alignItems: 'center', marginVertical: 20 }}>
                        <Text style={{fontSize: FontSize.medium}}>Membership Id</Text>
                        <TextInput
                            style={[styles.textInput]}
                            value={membershipId}
                            placeholderTextColor="gray"
                            placeholder="Enter membership id"
                            onChangeText={(val)=>{setError(false); setMembershipId(val);}}
                        />
                        {error && <Text style={{width: '90%', color: GlobalColors.error, fontSize: FontSize.small}}>Membership ID is invalid !</Text>}
                    </View>
                    <TouchableOpacity style={{width: '90%', backgroundColor: membershipId ? GlobalColors.blue: 'lightgray', borderRadius: 5, alignSelf: 'center', marginBottom: 20, marginTop: 10}} disabled={membershipId==""}
                    onPress={validateCheckMembership}>
                        <Text style={{textAlign: 'center', paddingVertical: 5, fontSize: FontSize.large, color: '#fff', fontWeight: '500'}}>Validate & Apply</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalView: {
        width: '80%',
        backgroundColor: '#fff',
        paddingVertical: 5,
        paddingHorizontal: 5,
        borderRadius: 5
    },
    textInput: {
        width: '90%',
        paddingHorizontal: 10,
        paddingVertical: 10,
        marginTop: 10,
        borderWidth: 0.5,
        borderColor: 'lightgray',
        borderRadius: 2,
    },
});

export default MembershipValidationModal;