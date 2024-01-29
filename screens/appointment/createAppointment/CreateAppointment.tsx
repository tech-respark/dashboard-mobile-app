import { FontAwesome, FontAwesome5, Ionicons } from "@expo/vector-icons";
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
import { SearchBar } from "react-native-screens";
import SearchModal from "./SearchGuest";
import { TimerWithBorderHeader } from "../../../components/HeaderTextField";

const CreateAppointment = ({ navigation, route }: any) => {

    const isFocused = useIsFocused();
    const dispatch = useAppDispatch();
    const storeId = useAppSelector(selectBranchId);
    const tenantId = useAppSelector(selectTenantId);

    const [customers, setCustomers] = useState<{ [key: string]: any }[]>([]);
    const [selectedCustomerIndex, setSelectedCustomerIndex] = useState<number>(0);
    const [fromTime, setFromTime] = useState<string>(route.params.from);
    const [toTime, setToTime] = useState<string>(route.params.to);

    const getCustomersData = async () => {
        const url = environment.guestUrl + `customer/getByTenantStoreMinimal?tenantId=${tenantId}&storeId=${storeId}`;
        let response = await makeAPIRequest(url, null, "GET");
        if (response) {
            setCustomers(response);
        } else {
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
        }
    }, [isFocused])

    return (
        <View style={{ flex: 1 }}>
            <ScrollView style={styles.container}>
                <View style={GlobalStyles.sectionView}>
                    <View style={styles.justifiedRow}>
                        <Text style={{ fontSize: FontSize.large, fontWeight: '500' }}>1. Guest Details</Text>
                        <View style={styles.justifiedRow}>
                            <Text style={{ color: GlobalColors.blue, marginRight: 10 }}>Add User</Text>
                            <TouchableOpacity style={{ backgroundColor: GlobalColors.blue, borderRadius: 20, padding: 3 }}
                                onPress={() => { }}>
                                <Ionicons name="add" size={25} color="#fff" />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <SearchModal customerData={customers} setSelectedCustomerIndex={(val) => setSelectedCustomerIndex(val)} />
                </View>

                <View style={GlobalStyles.sectionView}>
                    <View style={styles.justifiedRow}>
                        <Text style={{ fontSize: FontSize.large, fontWeight: '500' }}>2. Service Details</Text>
                        <View style={styles.justifiedRow}>
                            <Text style={{ color: GlobalColors.blue, marginRight: 10 }}>Add Service</Text>
                            <TouchableOpacity style={{ backgroundColor: GlobalColors.blue, borderRadius: 20, padding: 3 }}
                                onPress={() => { }}>
                                <Ionicons name="add" size={25} color="#fff" />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.justifiedRow}>
                        <TimerWithBorderHeader value={fromTime} setValue={(val)=>{setFromTime(val)}} header="From Time"/>
                        <TimerWithBorderHeader value={toTime} setValue={(val)=>{setToTime(val)}} header="To Time"/>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 5,
        paddingVertical: 10
    },
    justifiedRow: {
        flexDirection: "row",
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    textInput: {
        paddingHorizontal: 10
    }
});

export default CreateAppointment;