import { Ionicons } from "@expo/vector-icons";
import moment from "moment";
import React, { FC } from "react";
import { StyleSheet, Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { GlobalColors } from "../../../../Styles/GlobalStyleConfigs";
import { GlobalStyles } from "../../../../Styles/Styles";

interface IProfileInfo {
    customer: { [key: string]: any }
}

const ProfileInfo: FC<IProfileInfo> = ({ customer }) => {
    return (
        <View style={[styles.cardView, GlobalStyles.shadow]}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View style={{ maxWidth: '48%' }}>
                    <View style={styles.row}>
                        <Text style={{}}>Name: </Text>
                        <Text style={[styles.text, { maxWidth: '90%' }]}>{customer.firstName}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text>Email: </Text>
                        <Text style={[styles.text, { maxWidth: '90%' }]}>{customer.email}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text>Birth Date: </Text>
                        <Text style={styles.text}>{moment(customer.dob).format("DD MMM")}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text>Last Visted Date: </Text>
                        <Text style={styles.text}>{moment(customer.lastVisitedOn).format("YYYY/MM/DD")}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text>Loyalty Points: </Text>
                        <Text style={styles.text}>{customer?.loyalty?.availablePointsAll}</Text>
                    </View>
                </View>
                <View style={{ maxWidth: '48%' }}>
                    <View style={styles.row}>
                        <Text>Phone: </Text>
                        <Text style={styles.text}>{customer.mobileNo}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text>Gender: </Text>
                        <Text style={styles.text}>{customer.gender}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text>Anniversary: </Text>
                        <Text style={styles.text}>{moment(customer.anniversaryDate).format("DD MMM")}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text>Lifetime visit count: </Text>
                        <Text style={styles.text}>{customer.visitCount}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text>Referral Code: </Text>
                        <Text style={[styles.text, { maxWidth: '45%' }]}>{customer.referralCode}</Text>
                    </View>
                </View>
            </View>
            <View style={styles.row}>
                <Text>Customer Note: </Text>
                <Text style={[styles.text, {maxWidth: '70%'}]}>{customer.notes}</Text>
            </View>
            <View style={[styles.row, { marginTop: 20 }]}>
                <Text style={{ marginRight: 10 }}>Edit Profile</Text>
                <TouchableOpacity style={{ padding: 5, borderWidth: 0.5, borderColor: GlobalColors.blue, borderRadius: 5 }}>
                    <Ionicons name="pencil" size={20} color={GlobalColors.blue} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    row: {
        alignItems: 'center',
        flexDirection: 'row',
        marginVertical: 10
    },
    cardView: {
        borderWidth: 1,
        borderRadius: 5,
        paddingVertical: 20,
        paddingHorizontal: 10,
        width: '95%',
        borderColor: 'lightgray',
    },
    text: {
        fontWeight: '300',
        flexWrap: 'wrap',
    }
});

export default ProfileInfo;