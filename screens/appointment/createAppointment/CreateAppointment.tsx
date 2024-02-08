import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { FontSize, GlobalColors } from "../../../Styles/GlobalStyleConfigs";
import { useIsFocused } from "@react-navigation/native";
import { useAppDispatch, useAppSelector } from "../../../redux/Hooks";
import { setShowUserProfileTopBar } from "../../../redux/state/UIStates";
import { GlobalStyles } from "../../../Styles/Styles";
import { environment } from "../../../utils/Constants";
import { selectBranchId, selectTenantId } from "../../../redux/state/UserStates";
import { makeAPIRequest } from "../../../utils/Helper";
import Toast from "react-native-root-toast";
import { TimerWithBorderHeader } from "../../../components/HeaderTextField";
import SearchModal from "./SearchModal";
import Checkbox from 'expo-checkbox';
import CreateUser from "./CreateUser";

const CreateAppointment = ({ navigation, route }: any) => {

    const isFocused = useIsFocused();
    const dispatch = useAppDispatch();
    const storeId = useAppSelector(selectBranchId);
    const tenantId = useAppSelector(selectTenantId);

    const [customers, setCustomers] = useState<{ [key: string]: any }[]>([]);
    const [services, setServices] = useState<{ [key: string]: any }[]>([]);
    const [selectedCustomer, setSelectedCustomer] = useState<{[key:string]: any}>({});
    const [selectedExperts, setSelectedExperts] = useState<{[key:string]: any}>(route.params.staffObjects[route.params.selectedStaffIndex]);
    const [fromTime, setFromTime] = useState<string>(route.params.from);
    const [toTime, setToTime] = useState<string>(route.params.to);
    const [instructions, setInstructions] = useState<string>('');
    const [enableSMS, setEnableSMS] = useState<boolean>(true);

    const getCustomersData = async () => {
        const url = environment.guestUrl + `customer/getByTenantStoreMinimal?tenantId=${tenantId}&storeId=${storeId}`;
        let response = await makeAPIRequest(url, null, "GET");
        if (response) {
            setCustomers(response);
        } else {
            Toast.show("Encountered issue", { backgroundColor: GlobalColors.error });
        }
    };

    const getServices = async() => {
        const url = environment.documentBaseUri + `stores/getStoreByTenantAndStoreId?storeId=${storeId}&tenantId=${tenantId}`;
        let response = await makeAPIRequest(url, null, "GET")
        if(response){
            console.log("DATA", response)
            setServices(response.categories);
        }else {
            Toast.show("Encountered issue", { backgroundColor: GlobalColors.error });
        }
    };

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: "Create Appointment",
            headerTitleAlign: 'left',
            headerLeft: () => (
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name={"chevron-back-outline"} size={20} style={{ marginHorizontal: 5, color: GlobalColors.blue }} />
                </TouchableOpacity>
            ),
        });
    }, [navigation]);

    useEffect(() => {
        if (!isFocused)
            dispatch(setShowUserProfileTopBar());
        else {
            getCustomersData();
            getServices();
        }
    }, [isFocused]);

    return (
        <View style={{ flex: 1 }}>
            <ScrollView style={styles.container}>
                <View style={[GlobalStyles.sectionView, { zIndex: 2 }]}>
                    <View style={GlobalStyles.justifiedRow}>
                        <Text style={styles.headingText}>1. Guest Details</Text>
                            <CreateUser/>
                    </View>
                    <SearchModal data={customers} setSelectedIndex={(val: number) => setSelectedCustomer(customers[val])} type="customer" placeholderText="Search By Name Or Number" headerText="" />
                </View>

                <View style={[GlobalStyles.sectionView, {zIndex: 2}]}>
                    <View style={[GlobalStyles.justifiedRow, { marginBottom: 10 }]}>
                        <Text style={styles.headingText}>2. Service Details</Text>
                        <View style={GlobalStyles.justifiedRow}>
                            <Text style={{ color: GlobalColors.blue, marginRight: 10 }}>Add Service</Text>
                            <TouchableOpacity style={styles.circleIcon}
                                onPress={() => { }}>
                                <Ionicons name="add" size={25} color="#fff" />
                            </TouchableOpacity>
                        </View>
                    </View>
                    {/* will be iterated for multiple */}
                    <SearchModal data={services} type="service" placeholderText="Search Service By Name" headerText="Service 1" />
                    <SearchModal data={route.params.staffObjects} type="expert" placeholderText="Search Expert" headerText="Expert 1" selectedValue={selectedExperts.name} setSelectedIndex={(val) => setSelectedExperts(route.params.staffObjects[val])}/>

                    <Text onPress={() => { }} style={{ color: GlobalColors.blue, textDecorationLine: 'underline' }}>Add Expert</Text>
                    <View style={[GlobalStyles.justifiedRow, { marginTop: 20 }]}>
                        <TimerWithBorderHeader value={fromTime} setValue={(val) => { setFromTime(val) }} header="From Time" />
                        <TimerWithBorderHeader value={toTime} setValue={(val) => { setToTime(val) }} header="To Time" />
                    </View>
                </View>

                <View style={GlobalStyles.sectionView}>
                    <Text style={styles.headingText}>3. Instruction Details</Text>
                    <TextInput
                        style={styles.textInput}
                        numberOfLines={4}
                        multiline
                        placeholder="Enter Appointment Instructions"
                        value={instructions}
                        placeholderTextColor="gray"
                        underlineColorAndroid="transparent"
                        onChangeText={(val) => {
                            setInstructions(val);
                        }}
                    />
                </View>
            </ScrollView>
            <View style={{ backgroundColor: '#fff', padding: 20, alignItems: 'center' }}>
                <View style={[GlobalStyles.justifiedRow, {justifyContent: 'space-between', width: '100%', marginBottom: 20}]}>
                    <View style={[GlobalStyles.justifiedRow, {width: '35%'}]}>
                        <Checkbox
                            color={"#4FACFE"}
                            style={{ borderColor: 'gray', borderRadius: 2, borderWidth: 0.5 }}
                            value={enableSMS}
                            onValueChange={() => setEnableSMS(!enableSMS)}
                        />
                        <Text>{"SMS\nConfirmation"}</Text>
                    </View>
                    <Text onPress={() => {}} style={{color: GlobalColors.blue, textDecorationLine: 'underline'}}>Membership Validation</Text>
                </View>
                <TouchableOpacity style={{width: '100%', backgroundColor: GlobalColors.blue, paddingVertical: 10, borderRadius: 5, marginBottom: 5}}>
                    <Text style={{color: "#fff", textAlign: "center", fontSize: FontSize.large, fontWeight: '500'}}>Create</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 5,
        paddingVertical: 10
    },
    textInput: {
        paddingHorizontal: 10,
        paddingVertical: 10,
        marginVertical: 15,
        borderWidth: 0.5,
        borderColor: 'lightgray',
        borderRadius: 2,
    },
    headingText: {
        fontSize: FontSize.large,
        fontWeight: '500'
    },
    circleIcon: {
        backgroundColor: GlobalColors.blue,
        borderRadius: 20, padding: 3
    }
});

export default CreateAppointment;