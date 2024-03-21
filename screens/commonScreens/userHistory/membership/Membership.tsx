import React, { FC, useState } from "react";
import { Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { FontSize, GlobalColors } from "../../../../Styles/GlobalStyleConfigs";
import MembershipModal from "./MembershipModal";
import ShiftMembership from "./ShiftMembership";
import TransactionHistoryTable from "../../../../components/TransactionHistoryTable";

interface IMembership {
    customer: { [key: string]: any },
    setCustomer: (val: any) => void,
}

const Membership: FC<IMembership> = ({ customer, setCustomer }) => {
    const [modalVisible, setModalVisible] = useState<boolean>(false);

    return (
        <View style={{ width: '100%', flex: 1, paddingVertical: 20, paddingHorizontal: 10 }}>
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
                <TransactionHistoryTable data={customer.membershipHistory} headerList={["Name", "Start Date", "End Date"]}
                        keyList={["membershipPlan", "purchaseDate", "expiryDate"]} />
                    :
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ fontSize: FontSize.medium }}>No History yet</Text>
                    </View>
            }
            {modalVisible && <MembershipModal modalVisible={modalVisible} setModalVisible={setModalVisible} customer={customer} setCustomer={setCustomer}/>}
        </View>
    );
};

export default Membership;