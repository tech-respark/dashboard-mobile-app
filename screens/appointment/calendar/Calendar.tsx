import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { FontSize, GlobalColors } from "../../../Styles/GlobalStyleConfigs";
import { useAppDispatch, useAppSelector } from "../../../redux/Hooks";
import { selectBranchId, selectCurrentStoreConfig, selectStaffData, selectTenantId } from "../../../redux/state/UserStates";
import moment from "moment";
import { setIsLoading, setShowUserProfileTopBar } from "../../../redux/state/UIStates";
import { appointmentColorCodes, environment } from "../../../utils/Constants";
import { getActiveStaffsForAppointment, makeAPIRequest } from "../../../utils/Helper";
import Toast from "react-native-root-toast";
import { useIsFocused } from "@react-navigation/native";
import DateAndDropdown from "./DateAndDropdown";
import CalendarEntries from "./CalendarEntries";

const AppointmentCalendar = ({ navigation }: any) => {
    const staffList = useAppSelector(selectStaffData);
    const storeConfig = useAppSelector(selectCurrentStoreConfig);
    const storeId = useAppSelector(selectBranchId);
    const tenantId = useAppSelector(selectTenantId);
    const isFocused = useIsFocused();
    const dispatch = useAppDispatch();

    const [staffObjects, setStaffObjects] = useState<{ [key: string]: any }[]>([]);
    const [selectedStaffIndex, setSelectedStaffIndex] = useState<number>(0);
    const [selectedDate, setSelectedDate] = useState<string>(moment().format('YYYY-MM-DD'));
    const [appointmentCount, setAppointmentCount] = useState<number>(0);
    const [appointmentsData, setAppointmentsData] = useState<{ [key: string]: string }[]>([]);

    const getStaffShifts = async () => {
        const url = environment.sqlBaseUri + `staffshifts/${tenantId}/${storeId}/${selectedDate}`;
        let response = await makeAPIRequest(url, null, "GET");
        if (response) {
            let filteredList = getActiveStaffsForAppointment(response, staffList!);
            setStaffObjects(filteredList);
            return filteredList;
        } else {
            Toast.show("No Data Found", { backgroundColor: GlobalColors.error });
        }
        return [];
    };

    const getAppointmentsData = async (isFirstCall: boolean) => {
        let endDate = moment(selectedDate, 'YYYY-MM-DD').clone().add(15, 'days').format('YYYY-MM-DD');
        const url = environment.appointmentUri + `appointments/between?count=${appointmentCount}&end=${endDate}&start=${selectedDate}&storeid=${storeId}&tenantid=${tenantId}`;
        let response = await makeAPIRequest(url, null, "GET") ?? [];
        if (isFirstCall) {
            setAppointmentsData(response);
        } else if (response) {
            setAppointmentsData(prevState => [...prevState, ...response]);
        }
        setAppointmentCount(prevState => prevState + response.length);
    };

    const initialStatesHandler = async () => {
        if (staffList && storeConfig) {
            dispatch(setIsLoading({ isLoading: true }));
            setAppointmentCount(0);
            await getStaffShifts();
            getAppointmentsData(true);
            dispatch(setIsLoading({ isLoading: false }));
        }
    };

    useEffect(() => {
        if (isFocused) {
            initialStatesHandler();
        }
    }, [isFocused, selectedDate]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            getAppointmentsData(false);
        }, 20000);
        return () => clearInterval(intervalId);
    }, [appointmentCount]);

    return (
        <View style={styles.container}>
            <DateAndDropdown selectedDate={selectedDate} setSelectedDate={(value) => { setSelectedDate(value) }} />
            <View style={styles.staffView}>
                <ScrollView horizontal showsHorizontalScrollIndicator >
                    {staffObjects.map((staff: any, index: number) => (
                        <Pressable
                            key={index}
                            style={[styles.staffViewSingle, index === selectedStaffIndex && { borderBottomWidth: 2, borderColor: GlobalColors.blue }]}
                            onPress={() => { setSelectedStaffIndex(index) }}
                        >
                            <Text style={{ color: index === selectedStaffIndex ? "#000" : GlobalColors.grayDark }}>{staff.name}</Text>
                        </Pressable>
                    ))}
                </ScrollView>
            </View>
            <CalendarEntries selectedDate={selectedDate} selectedStaffIndex={selectedStaffIndex} staffObjects={staffObjects} appointmentsData={appointmentsData} navigation={navigation}/>
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: "#fff"
    },
    staffView: {
        backgroundColor: GlobalColors.lightGray2,
        maxHeight: '8%',
        marginBottom: 10
    },
    staffViewSingle: {
        justifyContent: "center",
        alignItems: "center",
        marginHorizontal: 5,
        paddingHorizontal: 5,
    },
});

export default AppointmentCalendar;