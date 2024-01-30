import React, { useEffect, useState } from "react";
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

const AppointmentCalendar = ({ navigation }: any) => {
    const staffList = useAppSelector(selectStaffData);
    const storeConfig = useAppSelector(selectCurrentStoreConfig);
    const storeId = useAppSelector(selectBranchId);
    const tenantId = useAppSelector(selectTenantId);
    const isFocused = useIsFocused();
    const dispatch = useAppDispatch();

    const [staffObjects, setStaffObjects] = useState<{ [key: string]: any }[]>([]);
    const [selectedStaffIndex, setSelectedStaffIndex] = useState<number>(0);
    const [timeIntervals, setTimeIntervals] = useState<{ [key: string]: string }>({});
    const [timeSlots, setTimeSlots] = useState<number[]>([]);
    const [selectedDate, setSelectedDate] = useState<string>(moment().format('YYYY-MM-DD'));
    const [appointmentCount, setAppointmentCount] = useState<number>(0);
    const [appointmentsData, setAppointmentsData] = useState<{ [key: string]: string }[]>([]);
    const [expertAppointments, setExpertAppointments] = useState<{ [key: string]: any }>({});
    const [timeYPositions, setTimeYPositions] = useState<{ [key: string]: number }>({});

    const getTimeIntervalList = () => {
        const timeObject: { [key: string]: string } = {};
        const start = new Date(`1970-01-01T${storeConfig!['startTime']}`);
        const end = new Date(`1970-01-01T${storeConfig!['closureTime']}`);
        while (start <= end) {
            const timeString = start.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: false });
            const formattedTime = start.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
            timeObject[timeString] = formattedTime;
            start.setMinutes(start.getMinutes() + 15);
        }
        setTimeIntervals(timeObject);
        return timeObject;
    };

    const setTimeSlotsInTable = (timeIntervals: { [key: string]: string }, staffs: { [key: string]: any }[]) => {
        let slots = staffs[selectedStaffIndex]["slot"].split("-");
        const initialTimeSlots = Array.from({ length: Object.values(timeIntervals).length }, (_, index) => {
            const currentTime = Object.keys(timeIntervals)[index];
            return currentTime >= slots[0] && currentTime <= slots[1] ? 1 : 0;
        });
        setTimeSlots(initialTimeSlots);
    };

    const getExpertAppointmentTimes = (appointments: { [key: string]: any }[], staffs = staffObjects) => {
        let newAppointments: { [key: string]: any } = {};
        appointments.forEach(appointment => {
            let currentExpertId = staffs[selectedStaffIndex]['staffId'];
            if (moment(appointment.appointmentDay).format('YYYY-MM-DD') == selectedDate) {
                let expertAppoint = appointment.expertAppointments.find((expert: any) => expert.expertId === currentExpertId);
                expertAppoint ? newAppointments[expertAppoint.slot] = appointment : null;
            }
        });
        setExpertAppointments(newAppointments);
    };

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

    const getAppointmentsData = async (staffs: { [key: string]: any }[]) => {
        dispatch(setIsLoading({ isLoading: true }));
        let endDate = moment(selectedDate, 'YYYY-MM-DD').clone().add(15, 'days').format('YYYY-MM-DD');
        const url = environment.appointmentUri + `appointments/between?count=${appointmentCount}&end=${endDate}&start=${selectedDate}&storeid=${storeId}&tenantid=${tenantId}`;
        let response = await makeAPIRequest(url, null, "GET");
        setAppointmentsData(response);
        dispatch(setIsLoading({ isLoading: false }));
    };

    const initialStatesHandler = async () => {
        if (staffList && storeConfig) {
            dispatch(setIsLoading({ isLoading: true }));
            let staffs = await getStaffShifts();
            getAppointmentsData(staffs);
            dispatch(setIsLoading({ isLoading: false }));
        }
    };

    useEffect(() => {
        getTimeIntervalList();
    }, [])

    useEffect(() => {
        isFocused ? initialStatesHandler() : null;
    }, [isFocused, selectedDate]);

    useEffect(() => {
        if (staffObjects.length > 0) {
            setTimeSlotsInTable(timeIntervals, staffObjects);
            if (appointmentsData.length > 0)
                getExpertAppointmentTimes(appointmentsData);
        }
    }, [selectedStaffIndex, appointmentsData])

    return (
        <View style={styles.container}>
            <DateAndDropdown selectedDate={selectedDate} setSelectedDate={(value) => { setSelectedDate(value) }} />
            {/* Calender view */}
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
            <View style={{ width: '100%' }}>
                {timeSlots.length > 0 ?
                    <ScrollView showsVerticalScrollIndicator contentContainerStyle={{ paddingBottom: '35%', paddingRight: 10 }}
                    >
                        {
                            Object.keys(timeIntervals).map((time: string, index: number) => (
                                <View key={index} style={{ flexDirection: "row", width: '100%', }}
                                    onLayout={(event) => {
                                        const layout = event.nativeEvent.layout;
                                        setTimeYPositions((prevPositions) => ({
                                            ...prevPositions,
                                            [time]: layout.y,
                                        }));
                                    }}>
                                    <View style={{ width: "30%", backgroundColor: GlobalColors.lightGray2, marginRight: 5 }}>
                                        <Text style={{ fontSize: 12, width: '90%', textAlign: 'center' }}>{timeIntervals[time]}</Text>
                                    </View>
                                    <TouchableOpacity style={styles.cell}
                                        onPress={() => {
                                            if (timeSlots[index] != 0) {
                                                dispatch(setShowUserProfileTopBar());
                                                navigation.navigate("Create Appointment", { from: timeIntervals[time], to: timeIntervals[Object.keys(timeIntervals)[index + 1]], selectedStaffIndex: selectedStaffIndex, staffObjects: staffObjects });
                                            }
                                        }}
                                    >
                                        {timeSlots[index] == 0 ?
                                            <Text style={{ color: 'gray', fontStyle: 'italic' }}>Expert Unavailable</Text> :
                                            <Text></Text>
                                        }
                                    </TouchableOpacity>
                                </View>
                            ))}
                        {Object.keys(expertAppointments).map((appointmentTime: any, index: number) => {
                            let times = appointmentTime.split("-");
                            let bc = appointmentColorCodes[expertAppointments[appointmentTime]["status"].slice(-1)[0]["status"]];
                            return (
                                <View key={index} style={{
                                    position: 'absolute', zIndex: 1, top: timeYPositions[times[0]], height: timeYPositions[times[1]] - timeYPositions[times[0]], left: '30%',
                                    backgroundColor: bc, width: '69%', marginLeft: 5, padding: 10, borderRadius: 2
                                }}>
                                    <View style={{ flexDirection: "row", width: '100%', justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
                                        <Text style={{ fontWeight: "bold", maxWidth: '50%' }} ellipsizeMode="tail">{expertAppointments[appointmentTime]["guestName"]}</Text>
                                        <Text style={{ fontSize: FontSize.small }}>{timeIntervals[times[0]]}-{timeIntervals[times[1]]}</Text>
                                    </View>
                                    <Text ellipsizeMode="tail" numberOfLines={1} style={{ maxWidth: '60%' }}>{expertAppointments[appointmentTime]["expertAppointments"][0]["service"]}</Text>
                                </View>
                            );
                        })
                        }

                    </ScrollView> :
                    <View style={{ justifyContent: "center", alignItems: "center", height: '80%' }}>
                        <ActivityIndicator color={GlobalColors.blueLight} />
                        <Text style={{ margin: 10 }}>Loading Calendar</Text>
                    </View>
                }
            </View>
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: "#fff"
    },
    dateView: {
        justifyContent: "space-between",
        marginVertical: '4%',
        flexDirection: 'row',
        width: '100%',
        paddingHorizontal: 10
    },
    dateIcon: {
        padding: 2,
        backgroundColor: GlobalColors.lightGray2,
        borderRadius: 15
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
    cell: {
        flex: 1,
        borderWidth: 0.5,
        borderColor: '#ccc',
        marginVertical: 2,
        paddingVertical: 15,
        alignItems: 'center',
        borderRadius: 2,
    },
    dropdown: {
        borderWidth: 0.5,
        borderColor: 'lightgray',
        borderRadius: 5,
        paddingHorizontal: 10,
        justifyContent: 'center',
        alignContent: "center",
        width: '40%'
    },
});

export default AppointmentCalendar;