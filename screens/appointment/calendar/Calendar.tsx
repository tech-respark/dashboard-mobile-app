import React, { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { GlobalColors } from "../../../Styles/GlobalStyleConfigs";
import { useAppDispatch, useAppSelector } from "../../../redux/Hooks";
import { selectBranchId, selectCurrentStoreConfig, selectStaffData, selectTenantId } from "../../../redux/state/UserStates";
import moment from "moment";
import { setIsLoading, setShowUserProfileTopBar } from "../../../redux/state/UIStates";
import { APPOINTMENT_CHECKIN, APPOINTMENT_CONFIRMED, APPOINTMENT_CREATED, APPOINTMENT_FETCH_INTERVAL, APPOINTMENT_FUTURE, APPOINTMENT_ONLINE, APPOINTMENT_TOTAL, environment } from "../../../utils/Constants";
import { makeAPIRequest, mergeLists } from "../../../utils/Helper";
import Toast from "react-native-root-toast";
import { useIsFocused } from "@react-navigation/native";
import DateAndDropdown from "./DateAndDropdown";
import CalendarEntries from "./CalendarEntries";
import AppointmentsCardView from "../AppointmentsCardView";
import { getActiveStaffsForAppointment } from "../../../utils/Appointment";

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
    const [appointmentCount, setAppointmentCount] = useState<number | null>(null);
    const [appointmentsData, setAppointmentsData] = useState<{ [key: string]: string }[]>([]);
    const [selectedDropdown, setSelectedDropdown] = useState<string>(APPOINTMENT_CONFIRMED);
    const [categoryCount, setCategoryCount] = useState<{ [key: string]: number }>({ CONFIRMED: 0, ONLINE: 0, FUTURE: 0, COMPLETED: 0, CANCELLED: 0, TOTAL: 0 });
    const [tabWiseAppointments, setTabWiseAppointments] = useState<{ [key: string]: { [key: string]: any }[] }>({});

    const getStaffShifts = async () => {
        const url = environment.sqlBaseUri + `staffshifts/${tenantId}/${storeId}/${selectedDate}`;
        let response = await makeAPIRequest(url, null, "GET");
        if (response) {
            let filteredList = getActiveStaffsForAppointment(response, staffList!);
            if (filteredList.length <= selectedStaffIndex) {
                setSelectedStaffIndex(0);
            }
            setStaffObjects(filteredList);
            return filteredList;
        } else {
            Toast.show("No Data Found", { backgroundColor: GlobalColors.error });
        }
        return [];
    };

    const getAppointmentsData = async (appCount: number = appointmentCount ?? 0) => {
        let endDate = moment(selectedDate, 'YYYY-MM-DD').clone().add(15, 'days').format('YYYY-MM-DD');
        const url = environment.txnUrl + `appointments/between?count=${appCount}&end=${endDate}&start=${selectedDate}&storeid=${storeId}&tenantid=${tenantId}`;
        let response = await makeAPIRequest(url, null, "GET") ?? [];
        //For new date, if empty list is returned -> then need to set AppointmentData to []
        if(!appCount){
            setAppointmentsData(response);
            setAppointmentCount(response.length);   
        }else{
            const mergedList = mergeLists(appointmentsData, response);
            setAppointmentsData(mergedList);
            setAppointmentCount(mergedList.length);  
        }
    };

    const setAppointmentTypes = (appointments: { [key: string]: any }[]) => {
        const tempData: { [key: string]: { [key: string]: any }[] } = {
            "CONFIRMED": [],
            "ONLINE": [],
            "FUTURE": [],
            "COMPLETED": [],
            "CANCELLED": [],
        };
        const tempCategory: { [key: string]: number } = {};
        appointments.forEach(appointment => {
            let status = appointment.status.slice(-1)[0]['status']
            if(status==APPOINTMENT_CREATED && appointment.type == APPOINTMENT_ONLINE){
                tempData[APPOINTMENT_ONLINE]?.push(appointment);
                tempCategory[APPOINTMENT_ONLINE] = (tempCategory[APPOINTMENT_ONLINE] || 0) + 1;
            }
            else if (moment(appointment.appointmentDay).format('YYYY-MM-DD') == selectedDate) {
                status = status == APPOINTMENT_CHECKIN ? APPOINTMENT_CONFIRMED : status;
                tempData[status]?.push(appointment);
                tempCategory[status] = (tempCategory[status] || 0) + 1;
            } else {
                tempData[APPOINTMENT_FUTURE]?.push(appointment);
                tempCategory[APPOINTMENT_FUTURE] = (tempCategory[APPOINTMENT_FUTURE] || 0) + 1;
            }
        });
        tempCategory[APPOINTMENT_TOTAL] = appointments.length;
        setTabWiseAppointments(tempData);
        setCategoryCount(tempCategory);
    };

    const initialStatesHandler = async () => {
        if (staffList && storeConfig) {
            dispatch(setIsLoading({ isLoading: true }));
            setAppointmentCount(0);
            await getStaffShifts();
            getAppointmentsData(0);
            dispatch(setIsLoading({ isLoading: false }));
        }
    };

    useEffect(() => {
        if (isFocused) {
            dispatch(setShowUserProfileTopBar({ showUserProfileTopBar: true }));
            initialStatesHandler();
        }
    }, [isFocused, selectedDate, staffList]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            getAppointmentsData();
        }, APPOINTMENT_FETCH_INTERVAL);
        return () => {
            clearInterval(intervalId)
        };
    }, [appointmentCount]);

    useEffect(() => {
        setAppointmentTypes(appointmentsData);
    }, [appointmentsData]);

    return (
        <View style={styles.container}>
            <DateAndDropdown selectedDate={selectedDate} setSelectedDate={(value) => { setSelectedDate(value) }} selectedDropdown={selectedDropdown} setSelectedDropdown={setSelectedDropdown} data={categoryCount} />
            {selectedDropdown == APPOINTMENT_CONFIRMED ?
                <>
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
                    <CalendarEntries selectedDate={selectedDate} selectedStaffIndex={selectedStaffIndex} staffObjects={staffObjects} appointmentsData={appointmentsData} navigation={navigation} />
                </> :
                <AppointmentsCardView selectedView={selectedDropdown} appointments={selectedDropdown == APPOINTMENT_TOTAL ? appointmentsData : tabWiseAppointments[selectedDropdown.toUpperCase()]} reFetchData={async () => { await initialStatesHandler() }} navigation={navigation} staffObjects={staffObjects}/>
            }
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
        width: '100%',
        height: '8%',
        marginBottom: 10,
    },
    staffViewSingle: {
        justifyContent: "center",
        alignItems: "center",
        marginHorizontal: 5,
        paddingHorizontal: 5,
    },
});

export default AppointmentCalendar;