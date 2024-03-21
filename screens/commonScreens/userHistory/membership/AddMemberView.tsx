import React, { FC, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { GlobalStyles } from "../.././../../Styles/Styles";
import { FontSize, GlobalColors } from "../../../../Styles/GlobalStyleConfigs";
import { Ionicons } from "@expo/vector-icons";
import { MultiSelect } from "react-native-element-dropdown";
import AddFamilyMemberModal from "../../../../screens/appointment/common/AddFamilyMemberModal";

interface IAddMemberView{
    customer: {[key: string]: any},
    setCustomer: (val: any) => void,
    selectedFamily: string[],
    setSelectedFamily: (val: string[] ) => void,
}

const AddMemberView: FC<IAddMemberView> = ({customer, selectedFamily, setSelectedFamily, setCustomer}) => {
    const [secondModal, setSecondModal] = useState<boolean>(false);

    return (
        <View style={{ marginBottom: 15, width: '100%', alignSelf: 'center', borderWidth: 0.5, padding: 10, borderColor: 'lightgray', borderRadius: 2 }}>
            {
                secondModal && <AddFamilyMemberModal modalVisible={secondModal} setModalVisible={setSecondModal} customer={customer} setCustomer={setCustomer} />
            }
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
    );
};

const styles = StyleSheet.create({
    selectedStyle: {
        borderRadius: 15,
        backgroundColor: GlobalColors.lightGray2,
        borderColor: '#fff'
    },
    container: { 
        width: '100%'
     },
     dropdown: {
        width: '60%',
        backgroundColor: 'transparent',
        borderColor: 'lightgray',
        borderWidth: 0.5,
        borderRadius: 5,
        paddingHorizontal: 5,
        marginBottom: 5
    },

});

export default AddMemberView;