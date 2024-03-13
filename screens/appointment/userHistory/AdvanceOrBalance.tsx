import React, { FC, useEffect, useState } from "react";
import { ActivityIndicator, Image, Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { GlobalStyles } from "../../../Styles/Styles";
import { FontSize, GlobalColors } from "../../../Styles/GlobalStyleConfigs";
import { TextInput, TouchableOpacity } from "react-native-gesture-handler";
import { environment } from "../../../utils/Constants";
import { useAppSelector } from "../../../redux/Hooks";
import { selectBranchId, selectPaymentTypes, selectTenantId, selectUserData } from "../../../redux/state/UserStates";
import { makeAPIRequest } from "../../../utils/Helper";
import LoadingState from "../../../components/LoadingState";
import moment from "moment";
import Toast from "react-native-root-toast";

interface IAdvanceOrBalance {
    isAdvance: boolean,
    customer: { [key: string]: any },
    setCustomer: (val: any) => void,
}

const AdvanceOrBalance: FC<IAdvanceOrBalance> = ({ isAdvance, customer, setCustomer }) => {
    const storeId = useAppSelector(selectBranchId);
    const tenantId = useAppSelector(selectTenantId);
    const paymentTypes = useAppSelector(selectPaymentTypes);
    const loggedInUser = useAppSelector(selectUserData);

    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [history, setHistory] = useState<{ [key: string]: any }[]>([]);
    const [loader, setLoader] = useState<boolean>(false);
    const [loader2, setLoader2] = useState<boolean>(false);
    const [amount, setAmount] = useState<string>("");
    const [remark, setRemark] = useState<string>("");
    const [paymode, setPaymode] = useState<string>("");

    const fetchHistory = async () => {
        setLoader(true);
        const url = environment.txnUrl + `${isAdvance ? "advanceDetails" : "balanceDetails"}?guestId=${customer.id}&storeId=${storeId}&tenantId=${tenantId}`;
        let response = await makeAPIRequest(url, null, "GET");
        if (response && response.code == 200) {
            setHistory(response.data);
        }
        setLoader(false);
    };

    const setAdvanceOrBalance = async () => {
        let msg = !amount ? "Enter Amount" : !paymode ? "Select Paymode" : !remark ? "Enter Remark" : "";
        if (msg) {
            Toast.show(msg, { backgroundColor: GlobalColors.error, opacity: 1.0 });
            return
        }
        setLoader2(true);
        const url = environment.txnUrl + `advancebalance/payment`;
        let body: { [key: string]: any } = {
            createdBy: loggedInUser!.id,
            createdOn: moment().toISOString(),
            guestId: customer.id,
            paymode: paymode,
            remark: remark,
            storeId: storeId,
            tenantId: tenantId,
            ...(isAdvance ? { advanceAmount: amount } : { paidBalanceAmount: amount })
        }
        let response = await makeAPIRequest(url, body, "POST");
        setLoader2(false);
        if (response && response.code == 200) {
            let tempCus = { ...customer, ...(isAdvance ? { advanceAmount: customer.advanceAmount + parseInt(amount) } : { balAmount: customer.balAmount - parseInt(amount) }) }
            setCustomer(tempCus);
            setModalVisible(false);
            Toast.show(isAdvance ? "Advance Added Successfully" : "Due Balance Cleared Successfully", { backgroundColor: GlobalColors.success, opacity: 1.0 });
        }
        else {
            Toast.show("Encountered error", { backgroundColor: GlobalColors.error });
        }
    };

    useEffect(() => {
        if (!modalVisible) {
            fetchHistory();
            setAmount("");
            setRemark("");
            setPaymode("");
        }
    }, [modalVisible, isAdvance])

    return (
        <View style={{ width: '100%', flex: 1, paddingVertical: 20, paddingHorizontal: 10 }}>
            <Text>{isAdvance ? (customer.advanceAmount ? `Total Advance paid: ₹${customer.advanceAmount}` : "No Advance added yet !")
                : (customer.balAmount ? `Total Due Balance: ₹${customer.balAmount}` : "No Due Balance")}
            </Text>
            <View style={{ justifyContent: 'flex-end', flexDirection: 'row', marginBottom: 15 }}>
                <TouchableOpacity style={{ backgroundColor: history.length > 0 || isAdvance ? GlobalColors.blue : 'lightgray', borderRadius: 5 }}
                    onPress={() => { setModalVisible(true) }} disabled={history.length == 0 && !isAdvance}
                >
                    <Text style={{ color: "#fff", padding: 10, fontSize: FontSize.medium }}>{isAdvance ? "Add Advance" : "Clear Balance"}</Text>
                </TouchableOpacity>
            </View>
            <Text style={{ fontSize: FontSize.medium, fontWeight: '500', marginBottom: 10 }}>{isAdvance ? "Advance" : "Due Balance"} History</Text>
            {
                history.length > 0 ?
                    <ScrollView style={[GlobalStyles.cardView, GlobalStyles.shadow]}>
                        <View style={[{ paddingVertical: 10, backgroundColor: 'lightgray', borderRadius: 5, marginBottom: 5, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly' }]}>
                            <Text style={styles.tableHeaderCell}>Date</Text>
                            <Text style={styles.tableHeaderCell}>Credit Amount</Text>
                            <Text style={styles.tableHeaderCell}>Debited Amount</Text>
                            <Text style={styles.tableHeaderCell}>Type</Text>
                            <Text style={styles.tableHeaderCell}>Remark</Text>
                        </View>
                        <ScrollView>
                            {
                                history.map((data: any, index: number) => (
                                    <View key={index} style={[GlobalStyles.justifiedRow, { paddingHorizontal: 10, paddingVertical: 10, borderBottomWidth: 0.5, borderColor: 'gray' }]}>
                                        <Text style={[styles.tableHeaderCell, { fontSize: FontSize.small }]}>{data.date}</Text>
                                        <Text style={[styles.tableHeaderCell, { fontSize: FontSize.small }]}>{data.creditAmount}</Text>
                                        <Text style={[styles.tableHeaderCell, { fontSize: FontSize.small }]}>{data.debitAmount}</Text>
                                        <Text style={[styles.tableHeaderCell, { fontSize: FontSize.small }]}>{data.transactionType}</Text>
                                        <Text style={[styles.tableHeaderCell, { fontSize: FontSize.small }]}>{data.remark}</Text>
                                    </View>
                                ))
                            }
                        </ScrollView>
                    </ScrollView>
                    :
                    <LoadingState loader={loader} />
            }
            <Modal
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}>
                <View style={[GlobalStyles.modalbackground]}>
                    <View style={[styles.modalView]}>
                        {loader2 &&
                            <View style={[GlobalStyles.isLoading, { backgroundColor: '', }]}>
                                <ActivityIndicator color={GlobalColors.blue} size={"large"} />
                            </View>
                        }
                        <Text style={styles.heading}>{isAdvance ? "Add Advance Balance" : "Clear Balance"} </Text>
                        <Text style={{ width: '100%', marginBottom: 15 }}>{isAdvance ? `Add advance balance to ${customer.firstName}` : `${customer.firstName} has ₹${customer.balAmount} due payment`}</Text>
                        <ScrollView style={{ width: '100%' }}>
                            <View style={[{ flexDirection: 'row', width: '100%', alignItems: 'center', marginVertical: 15 }]}>
                                <Text style={{ fontSize: FontSize.medium, marginRight: 15 }}>Amount: </Text>
                                <TextInput
                                    style={styles.textInput}
                                    value={amount}
                                    placeholderTextColor="gray"
                                    placeholder="Enter Amount"
                                    underlineColorAndroid="transparent"
                                    onChangeText={(val) => {
                                        if (!val || parseInt(val) <= customer.balAmount) {
                                            setAmount(val);
                                        }
                                    }}
                                />
                            </View>
                            <View style={{ width: '100%', marginVertical: 15 }}>
                                <Text style={{ fontSize: FontSize.medium, marginBottom: 10 }}>Paymode</Text>
                                <View style={{ flexDirection: 'row', flexWrap: 'wrap', borderWidth: 0.5, borderColor: 'lightgray', borderRadius: 2 }}>
                                    {paymentTypes?.map((type: { [key: string]: any }, index: number) => (
                                        <Pressable style={[GlobalStyles.justifiedRow, styles.shadow, styles.paymentView, { backgroundColor: paymode == type.name ? GlobalColors.blueLight : '#fff', borderColor: paymode == type.name ? GlobalColors.blue : 'lightgray' }]} key={index}
                                            onPress={() => { setPaymode(type.name) }}
                                        >
                                            <Text>{type.name}</Text>
                                            <View style={{}}>
                                                <Image source={{ uri: type.img }} style={{ width: 25, height: 25 }} />
                                            </View>
                                        </Pressable>
                                    ))}
                                </View>
                            </View>
                            <View style={{ width: '100%', marginVertical: 15 }}>
                                <Text style={{ fontSize: FontSize.medium, marginBottom: 10 }}>Remark</Text>
                                <TextInput
                                    style={[styles.textInput, { width: '100%' }]}
                                    value={remark}
                                    placeholderTextColor="gray"
                                    placeholder="Enter Remark"
                                    underlineColorAndroid="transparent"
                                    onChangeText={(val) => {
                                        setRemark(val)
                                    }}
                                    multiline
                                />
                            </View>
                        </ScrollView>
                        <View style={[GlobalStyles.justifiedRow, styles.buttonsView, { marginTop: 15 }]}>
                            <Pressable style={[styles.buttonContainer, { marginRight: 20, width: '30%' }]}
                                onPress={() => { setModalVisible(false) }}>
                                <Text style={styles.buttonText}>Close</Text>
                            </Pressable>
                            <Pressable style={[styles.buttonContainer, { backgroundColor: GlobalColors.blue, width: '40%' }]}
                                onPress={async () => {
                                    setAdvanceOrBalance()
                                }}
                            >
                                <Text style={[styles.buttonText, { color: '#fff' }]}>Add</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    modalView: {
        width: '95%',
        margin: 5,
        backgroundColor: '#fff',
        borderRadius: 5,
        paddingVertical: 20,
        paddingHorizontal: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 2,
        shadowRadius: 5,
        elevation: 5,
    },
    heading: {
        fontSize: FontSize.headingX,
        fontWeight: '500',
        marginBottom: 20,
        color: GlobalColors.blue
    },
    buttonsView: {
        justifyContent: "flex-end",
        width: "100%",
        paddingTop: 15,
        borderTopColor: 'lightgray',
        borderTopWidth: 2
    },
    paymentView: {
        margin: 10,
        borderWidth: 0.5,
        justifyContent: 'space-evenly',
        padding: 5,
        borderColor: 'lightgray',
        borderRadius: 2
    },
    textInput: {
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderWidth: 0.5,
        borderRadius: 2,
        width: '50%'
    },
    shadow: {
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.25,
        shadowRadius: 1,
        elevation: 1,
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
    tableHeaderCell: {
        width: '20%',
        textAlign: 'center'
    }
});

export default AdvanceOrBalance;