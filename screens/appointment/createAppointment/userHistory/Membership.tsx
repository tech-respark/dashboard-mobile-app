import React, { FC, useEffect, useState } from "react";
import { Modal, ScrollView, StyleSheet, Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { FontSize, GlobalColors } from "../../../../Styles/GlobalStyleConfigs";
import { GlobalStyles } from "../../../../Styles/Styles";
import moment from "moment";
import { environment } from "../../../../utils/Constants";
import { useAppSelector } from "../../../../redux/Hooks";
import { selectBranchId, selectTenantId } from "../../../../redux/state/UserStates";
import { makeAPIRequest } from "../../../../utils/Helper";

interface IMembership {
    customer: { [key: string]: any }
}

const Membership: FC<IMembership> = ({ customer }) => {
    const storeId = useAppSelector(selectBranchId);
    const tenantId = useAppSelector(selectTenantId);
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [membershipDetails, setMembershipDetails] = useState<{ [key: string]: any }[]>([]);

    const getMemberships = async () => {
        const url = environment.documentBaseUri + `membership/${tenantId}/${storeId}`;
        const response = await makeAPIRequest(url, null, "GET");
        if (response.code == 200) {
            console.log(response)
            setMembershipDetails(response.data);
        }
    };

    useEffect(() => {
        // if (!customer.membershipHistory)
        //     setModalVisible(true);
        if (modalVisible) {
            getMemberships();
        }
    }, [modalVisible]);

    return (
        <View style={{ width: '100%', flex: 1, paddingVertical: 20, paddingHorizontal: 10 }}>
            <View style={{ justifyContent: 'flex-end', flexDirection: 'row', marginBottom: 15 }}>
                <TouchableOpacity style={{ backgroundColor: GlobalColors.blue, borderRadius: 5 }}
                    onPress={() => { setModalVisible(true) }}
                >
                    <Text style={{ color: "#fff", padding: 10, fontSize: FontSize.medium }}>Assign Membership</Text>
                </TouchableOpacity>
            </View>
            {
                customer.membershipHistory &&
                <View style={styles.cardView}>
                    <View style={[GlobalStyles.justifiedRow, { padding: 10, backgroundColor: 'lightgray', borderRadius: 5, marginBottom: 5 }]}>
                        <Text style={{ width: '40%' }}>Name</Text>
                        <Text>Start Date</Text>
                        <Text>End Date</Text>
                    </View>
                    {
                        customer.membershipHistory.map((membership: any, index: number) => (
                            <View style={[GlobalStyles.justifiedRow, { paddingHorizontal: 10, paddingVertical: 10, borderBottomWidth: 0.5, borderColor: 'gray' }]}>
                                <Text style={{ width: '40%' }}>{membership.membershipPlan}</Text>
                                <Text>{moment(membership.purchaseDate).format('YYYY-MM-DD')}</Text>
                                <Text>{moment(membership.expiryDate).format('YYYY-MM-DD')}</Text>
                            </View>
                        ))
                    }
                </View>
            }
            <Modal
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}>
                <View style={[GlobalStyles.modalbackground]}>
                    <View style={styles.modalView}>
                        <Text style={styles.heading}>Add Membership</Text>
                        <ScrollView horizontal style={{ width: '100%', maxHeight: '30%' }}>
                            {
                                membershipDetails.map((membership: any, index: number) => (
                                    <View style={{ width: 280, backgroundColor: GlobalColors.lightGray2, borderRadius: 5, margin: 10, paddingVertical: 10, paddingHorizontal: 10 }}>
                                        <Text style={{ fontSize: FontSize.headingX, marginBottom: 15}}>{membership.name}</Text>
                                        <Text style={{fontWeight: '300', marginBottom: 10}}>Pay ₹{membership.membershipFee} & Get ₹{membership.membershipFee + membership.benefit}</Text>
                                        <View style={[GlobalStyles.justifiedRow, {maxWidth: '95%'}]}>
                                            <Text style={{fontWeight: '300'}}>Validity: {membership.validity} Days</Text>
                                            <Text style={{fontWeight: '300'}}>Benefit: ₹{membership.benefit} Extra</Text>
                                        </View>
                                        <View style={{marginTop: 20, borderColor: GlobalColors.blue, borderWidth: 1, width: '50%', borderRadius: 5}}>
                                            <Text style={{fontSize: FontSize.heading, padding: 5, textAlign: 'center'}}>Fee ₹{membership.membershipFee}</Text>
                                        </View>
                                    </View>
                                ))
                            }
                        </ScrollView>
                        
                    </View>
                </View>
            </Modal>

        </View>
    );
};

const styles = StyleSheet.create({
    cardView: {
        borderWidth: 1,
        borderColor: 'lightgray',
        borderRadius: 5,
        backgroundColor: '#fff',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 2,
        paddingVertical: 10,
        paddingHorizontal: 5
    },
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
        height: '80%'
    },
    heading: {
        fontSize: FontSize.headingX,
        fontWeight: '500',
        marginBottom: 20,
        color: GlobalColors.blue
    },
});

export default Membership;