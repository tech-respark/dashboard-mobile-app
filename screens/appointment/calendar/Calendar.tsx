import React, { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { GlobalColors } from "../../../Styles/GlobalStyleConfigs";
import { useAppDispatch, useAppSelector } from "../../../redux/Hooks";
import { selectBranchId, selectCurrentStoreConfig, selectStaffData, selectTenantId } from "../../../redux/state/UserStates";
import moment from "moment";
import { setIsLoading, setShowUserProfileTopBar } from "../../../redux/state/UIStates";
import { APPOINTMENT_FETCH_INTERVAL, environment } from "../../../utils/Constants";
import { getActiveStaffsForAppointment, makeAPIRequest } from "../../../utils/Helper";
import Toast from "react-native-root-toast";
import { useIsFocused } from "@react-navigation/native";
import DateAndDropdown from "./DateAndDropdown";
import CalendarEntries from "./CalendarEntries";
import AppointmentsCardView from "../AppointmentsCardView";

type AppointmentCategoriesType =  {
    confirmed: number, online: number, future: number, completed: number, cancelled: number, total: number
}
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
    const [selectedDropdown, setSelectedDropdown] = useState<string>('confirmed');
    const [categoryCount, setCategoryCount] = useState<{[key: string]: number}>({confirmed: 0, online: 0, future: 0, completed: 0, cancelled: 0, total: 0 });
    const [tabWiseAppointments, setTabWiseAppointments] = useState<{ [key: string]: { [key: string]: any }[] }>({});

    const getStaffShifts = async () => {
        const url = environment.sqlBaseUri + `staffshifts/${tenantId}/${storeId}/${selectedDate}`;
        let response = await makeAPIRequest(url, null, "GET");
        console.log(response)
        if (response) {
            console.log("here 2")
            let filteredList = getActiveStaffsForAppointment(response, staffList!);
            console.log(filteredList)
            setStaffObjects(filteredList);
            return filteredList;
        } else {
            Toast.show("No Data Found", { backgroundColor: GlobalColors.error });
        }
        return [];
    };

    const getAppointmentsData = async (isFirstCall: boolean, appCount: number = appointmentCount) => {
        let endDate = moment(selectedDate, 'YYYY-MM-DD').clone().add(15, 'days').format('YYYY-MM-DD');
        const url = environment.appointmentUri + `appointments/between?count=${appCount}&end=${endDate}&start=${selectedDate}&storeid=${storeId}&tenantid=${tenantId}`;
        let response = await makeAPIRequest(url, null, "GET") ?? [];
        if (isFirstCall) {
            setAppointmentsData(response);
        } else if (response) {
            setAppointmentsData(prevState => [...prevState, ...response]);
        }
        setAppointmentCount(prevState => prevState + response.length);
    };

    const setAppointmentTypes = (appointments: { [key: string]: any }[]) => {
        const tempData: { [key: string]: { [key: string]: any }[] } = {
            'confirmed': [],
            'online': [],
            'future': [],
            'completed': [],
            'cancelled': [],
        };
        const tempCategory: { [key: string]: number } = {};
        appointments.forEach(appointment => {
            if(moment(appointment.appointmentDay).format('YYYY-MM-DD')==selectedDate){
                let status = appointment.status.slice(-1)[0]['status'].toLowerCase();
                tempData[status]?.push(appointment);
                tempCategory[status] = (tempCategory[status] || 0) + 1;
            }else{
                tempData['future']?.push(appointment);
                tempCategory['future'] = (tempCategory['future'] || 0) + 1;
            }
        });
        tempCategory['total'] = appointments.length;
        setTabWiseAppointments(tempData);
        setCategoryCount(tempCategory);
    };

    const initialStatesHandler = async () => {
        if (staffList && storeConfig) {
            dispatch(setIsLoading({ isLoading: true }));
            setAppointmentCount(0);
            await getStaffShifts();
            getAppointmentsData(true, 0);
            dispatch(setIsLoading({ isLoading: false }));
        }
    };

    useEffect(() => {
        if (isFocused) {
            dispatch(setShowUserProfileTopBar({showUserProfileTopBar: true}));
            initialStatesHandler();
        }
    }, [isFocused, selectedDate]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            getAppointmentsData(false);
        }, APPOINTMENT_FETCH_INTERVAL);
        return () => clearInterval(intervalId);
    }, [appointmentCount]);

    useEffect(() => {
        setAppointmentTypes(appointmentsData);
    }, [appointmentsData]);

    return (
        <View style={styles.container}>
            <DateAndDropdown selectedDate={selectedDate} setSelectedDate={(value) => { setSelectedDate(value) }} selectedDropdown={selectedDropdown} setSelectedDropdown={(val) => { setSelectedDropdown(val) }} data={categoryCount}/>
            { selectedDropdown == "confirmed" ?
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
                <AppointmentsCardView selectedView={selectedDropdown} appointments={selectedDropdown == "total" ? appointmentsData: tabWiseAppointments[selectedDropdown]}/>
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