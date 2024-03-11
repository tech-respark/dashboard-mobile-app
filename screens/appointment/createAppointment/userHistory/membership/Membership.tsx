import React, { FC, useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { FontSize, GlobalColors } from "../../../../../Styles/GlobalStyleConfigs";
import { GlobalStyles } from "../../../../../Styles/Styles";
import moment from "moment";
import MembershipModal from "./MembershipModal";
import ShiftMembership from "./ShiftMembership";

interface IMembership {
    customer: { [key: string]: any },
    setCustomer: (val: any) => void,
}

const Membership: FC<IMembership> = ({ customer, setCustomer }) => {
    const [modalVisible, setModalVisible] = useState<boolean>(false);

    return (
        <ScrollView style={{ width: '100%', flex: 1, paddingVertical: 20, paddingHorizontal: 10 }}>
            {customer.membership ? 
            <ShiftMembership customer={customer} setCustomer={setCustomer}/>
            :
            <View style={{ justifyContent: 'flex-end', flexDirection: 'row', marginBottom: 15 }}>
                <TouchableOpacity style={{ backgroundColor: GlobalColors.blue, borderRadius: 5 }}
                    onPress={() => { setModalVisible(true) }}
                >
                    <Text style={{ color: "#fff", padding: 10, fontSize: FontSize.medium }}>Assign Membership</Text>
                </TouchableOpacity>
            </View>
}
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
            {modalVisible && <MembershipModal modalVisible={modalVisible} setModalVisible={setModalVisible} customer={customer} setCustomer={setCustomer}/>}
        </ScrollView>
    );
};

const styles = StyleSheet.create({

});

export default Membership;