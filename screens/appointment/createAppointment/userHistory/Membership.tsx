import React, { FC, useEffect, useState } from "react";
import { Image, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { FontSize, GlobalColors } from "../../../../Styles/GlobalStyleConfigs";
import { GlobalStyles } from "../../../../Styles/Styles";
import moment from "moment";
import { MEMBERSHIPCOLORS, environment } from "../../../../utils/Constants";
import { useAppSelector } from "../../../../redux/Hooks";
import { selectBranchId, selectPaymentTypes, selectStaffData, selectTenantId } from "../../../../redux/state/UserStates";
import { makeAPIRequest } from "../../../../utils/Helper";
import { Svg, Path } from "react-native-svg";
import GuestExpertDropdown from "../GuestExpertDropdown";

interface IMembership {
    customer: { [key: string]: any }
}

const Membership: FC<IMembership> = ({ customer }) => {
    const storeId = useAppSelector(selectBranchId);
    const tenantId = useAppSelector(selectTenantId);
    const staffList = useAppSelector(selectStaffData);
    const paymentTypes = useAppSelector(selectPaymentTypes);

    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [membershipDetails, setMembershipDetails] = useState<{ [key: string]: any }[]>([]);
    const [validity, setValidity] = useState<string>("");
    const [price, setPrice] = useState<string>("");
    const [expert, setExpert] = useState<{ [key: string]: any }>({});
    const [remark, setRemark] = useState<string>('');

    const getMemberships = async () => {
        const url = environment.documentBaseUri + `membership/${tenantId}/${storeId}`;
        const response = await makeAPIRequest(url, null, "GET");
        if (response.code == 200) {
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
                    <ScrollView contentContainerStyle={{ marginBottom: 30 }}>
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
                        <ScrollView horizontal style={{ width: '100%', height: '35%' }}>
                            {
                                membershipDetails.map((membership: any, index: number) => (
                                    <View key={index} style={{ width: 280, backgroundColor: MEMBERSHIPCOLORS[index % MEMBERSHIPCOLORS.length].shade1, borderRadius: 5, margin: 10 }}>
                                        <Svg height={280} width={280} viewBox="0 0 1440 320">
                                            <Path
                                                fill={MEMBERSHIPCOLORS[index % MEMBERSHIPCOLORS.length].shade2}
                                                d="M0,160L48,181.3C96,203,192,245,288,250.7C384,256,480,224,576,192C672,160,768,128,864,106.7C960,85,1056,75,1152,96C1248,117,1344,171,1392,197.3L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                                            />
                                        </Svg>
                                        <View style={{ zIndex: 2, position: 'absolute', paddingVertical: 10, paddingHorizontal: 10 }}>
                                            <Text style={{ fontSize: FontSize.headingX, marginBottom: 15 }}>{membership.name}</Text>
                                            <Text style={{ fontWeight: '300', marginBottom: 10 }}>Pay ₹{membership.membershipFee} & Get ₹{membership.membershipFee + membership.benefit}</Text>
                                            <View style={[GlobalStyles.justifiedRow, { maxWidth: '95%' }]}>
                                                <Text style={{ fontWeight: '300' }}>Validity: {membership.validity} Days</Text>
                                                <Text style={{ fontWeight: '300' }}>Benefit: ₹{membership.benefit} Extra</Text>
                                            </View>
                                            <View style={{ marginTop: 20, borderColor: MEMBERSHIPCOLORS[index % MEMBERSHIPCOLORS.length].shade3, borderWidth: 1, width: '55%', borderRadius: 5 }}>
                                                <Text style={{ fontSize: FontSize.heading, padding: 5, textAlign: 'center' }}>Fee ₹{membership.membershipFee}</Text>
                                            </View>
                                        </View>
                                    </View>
                                ))
                            }
                        </ScrollView>
                        <ScrollView style={{ paddingHorizontal: 10, width: '100%', marginVertical: 10 }}>
                            <View style={{ borderTopWidth: 1, borderBottomWidth: 1, borderColor: 'lightgray', padding: 10, marginBottom: 10 }}>
                                <Text style={{ fontSize: FontSize.heading, fontWeight: '500' }}>Advance: {customer.advanceAmount}</Text>
                            </View>
                            <View style={GlobalStyles.justifiedRow}>
                                <View style={{ width: '45%' }}>
                                    <Text style={{fontSize: FontSize.medium}}>Validity (Days)</Text>
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
                                    <Text style={{fontSize: FontSize.medium}}>Price</Text>
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
                                <Text style={{fontSize: FontSize.medium}}>Staff</Text>
                                <GuestExpertDropdown data={staffList!} placeholderText="Select Staff" type="expert" selectedValue={expert.name} setSelected={setExpert} />
                            </View>
                            <View>
                                <Text style={{fontSize: FontSize.large, marginBottom: 10}}>Payment Details:</Text>
                                <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 15 }}>
                                    {paymentTypes?.map((type: { [key: string]: any }, index: number) => (
                                        <View style={{margin: 10, width: '25%'}} key={index}>
                                            <Text>{type.name}</Text>
                                            <View style={[{borderWidth: 0.5, borderColor: 'lightgray', borderRadius: 2, padding: 3, marginVertical: 5, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly'}]}>
                                                <Image source={{uri: type.img}} style={{width: 25, height: 25}}/>
                                                <TextInput
                                                    style={{borderBottomWidth: 0.5, width: '50%', borderColor: 'gray'}}
                                                />
                                            </View>
                                        </View>
                                    ))}
                                </View>
                                <View>
                                    <Text style={{fontSize: FontSize.large, marginBottom: 10}}>Remark:</Text>
                                    <TextInput
                                        style={styles.textInput}
                                        placeholder="Enter Remark"
                                        value={remark}
                                        onChangeText={setRemark}
                                    />
                                </View>
                            </View>
                        </ScrollView>
                        <View style={[GlobalStyles.justifiedRow, { justifyContent: "flex-end", width: "100%", paddingTop: 15, borderTopColor: 'lightgray', borderTopWidth: 2}]}>
                            <Pressable style={[styles.buttonContainer, { marginRight: 20, width: '30%' }]}
                                onPress={() => { setModalVisible(false) }}
                            >
                                <Text style={styles.buttonText}>Cancel</Text>
                            </Pressable>
                            <Pressable style={[styles.buttonContainer, { backgroundColor: GlobalColors.blue, marginRight: 20, width: '40%'}]}
                                onPress={async () => {  }}
                            >
                                <Text style={[styles.buttonText, { color: '#fff' }]}>Add Membership</Text>
                            </Pressable>
                        </View> 
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
});

export default Membership;