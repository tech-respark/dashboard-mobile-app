import React, { FC } from "react";
import { StyleSheet, Text, View } from "react-native";
import { GlobalStyles } from "../../../../../Styles/Styles";
import moment from "moment";
import { FontSize, GlobalColors } from "../../../../../Styles/GlobalStyleConfigs";
import { TouchableOpacity } from "react-native-gesture-handler";

interface IShiftMembership {
    customer: { [key: string]: any },
    setCustomer: (val: any) => void,
    days: number
}
const ShiftMembership: FC<IShiftMembership> = ({ customer, setCustomer, days }) => {
    let isEditable = false

    return (
        <View style={[GlobalStyles.cardView, GlobalStyles.shadow, { paddingHorizontal: 10 }]}>
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
                    <Text>{moment(customer.membership.toDate).format('YYYY-MM-DD')}</Text>
                    {/* For Remaining hours */}
                </View>
                {days <= 10 && <Text style={{ color: GlobalColors.error, fontSize: FontSize.small }}>Expires in {days} days</Text>}
            </View>

            {customer.membership.balanceAmount && <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 5 }}>
                <Text style={{ fontWeight: '500', marginRight: 10 }}>Balance Amount:</Text>
                <Text>{customer.membership.balanceAmount}</Text>
            </View>}

            {/* remark add */}

            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.buttonView}
                onPress={()=>{}}
                >
                    <Text style={styles.buttonText}>Shift Membership</Text>
                </TouchableOpacity>
                {
                    isEditable &&
                    <TouchableOpacity style={[styles.buttonView, {marginLeft: 15}]}
                    onPress={()=>{}}>
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
    buttonContainer: { flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', borderTopWidth: 1, borderColor: 'lightgray', padding: 10, marginTop: 10 }

});

export default ShiftMembership;