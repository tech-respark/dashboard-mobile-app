import React, { FC, useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { FontSize, GlobalColors } from "../../../Styles/GlobalStyleConfigs";
import { useAppDispatch, useAppSelector } from "../../../redux/Hooks";
import { selectCurrentStoreConfig } from "../../../redux/state/UserStates";
import moment from "moment";
import { setIsLoading, setShowUserProfileTopBar } from "../../../redux/state/UIStates";
import { appointmentColorCodes } from "../../../utils/Constants";
import { useTimeIntervalList } from "../../../customHooks/AppointmentHooks";

interface ICalenderEntries {
    selectedStaffIndex: number,
    staffObjects: { [key: string]: any }[],
    selectedDate: string,
    appointmentsData: { [key: string]: string }[],
    navigation: any
}

const CalendarEntries: FC<ICalenderEntries> = ({ selectedStaffIndex, staffObjects, selectedDate, appointmentsData, navigation }) => {
    const dispatch = useAppDispatch();
    const timeIntervals = useTimeIntervalList();

    const [timeYPositions, setTimeYPositions] = useState<{ [key: string]: number }>({});
    const [expertAppointments, setExpertAppointments] = useState<{ [key: string]: any }>({});
    const [timeSlots, setTimeSlots] = useState<number[]>([]);

    const setTimeSlotsInTable = (timeIntervals: { [key: string]: string }, staffs: { [key: string]: any }[]) => {
        let slots = staffs[selectedStaffIndex]["slot"].split("-");
        const initialTimeSlots = Array.from({ length: Object.values(timeIntervals).length }, (_, index) => {
            const currentTime = Object.keys(timeIntervals)[index];
            return currentTime >= slots[0] && currentTime <= slots[1] ? 1 : 0;
        });
        setTimeSlots(initialTimeSlots);
    };

    //TODO: handle appointment overlapping
    const getExpertAppointmentTimes = (appointments: { [key: string]: any }[]) => {
        let newAppointments: { [key: string]: any } = {};
        appointments.forEach(appointment => {
            let currentExpertId = staffObjects[selectedStaffIndex]['staffId'];
            if (moment(appointment.appointmentDay).format('YYYY-MM-DD') == selectedDate) {
                appointment.expertAppointments.forEach((expertAppoint: any) => {
                    expertAppoint.contributions.forEach((contributor: any) => {
                        if(contributor.expertId === currentExpertId){
                            newAppointments[expertAppoint.slot] = appointment
                        }
                    })
                })   
            }
        });
        setExpertAppointments(newAppointments);
    };

    useEffect(() => {
        if (staffObjects.length > 0) {
            setTimeSlotsInTable(timeIntervals, staffObjects);
            getExpertAppointmentTimes(appointmentsData);
        }else{
            setTimeSlots([]);
        }
    }, [selectedStaffIndex, appointmentsData]);

    const emptyCalenderView = () => {
        let positions: { [key: string]: number } = {};
        let intervalKeys = Object.keys(timeIntervals);
        return (
            intervalKeys.map((time: string, index: number) => {
                return (
                    <View key={index} style={{ flexDirection: "row", width: '100%' }}
                        onLayout={(event) => {
                            const layout = event.nativeEvent.layout;
                            positions[time] = layout.y
                            if (Object.keys(positions).length == intervalKeys.length) {
                                setTimeYPositions(positions);
                            }
                        }}>
                        <View style={styles.timeSlotView}>
                            <Text style={styles.timeSlotText}>{timeIntervals[time]}</Text>
                        </View>
                        <TouchableOpacity style={styles.cell}
                            onPress={() => {
                                if (timeSlots[index] != 0) {
                                    dispatch(setShowUserProfileTopBar({showUserProfileTopBar: false}));
                                    navigation.navigate("Create Appointment", { from: time, to: Object.keys(timeIntervals)[index + 1], selectedStaffIndex: selectedStaffIndex, staffObjects: staffObjects, selectedDate: selectedDate });
                                }
                            }}
                        >
                            {timeSlots[index] == 0 ?
                                <Text style={{ color: 'gray', fontStyle: 'italic' }}>Expert Unavailable</Text> :
                                <Text></Text>
                            }
                        </TouchableOpacity>
                    </View>
                )
            })
        );
    };

    return (
        <View style={{ width: '100%' }}>
            {timeSlots.length > 0 ?
                <ScrollView showsVerticalScrollIndicator contentContainerStyle={{ paddingBottom: '35%', paddingRight: 10 }}>
                    {emptyCalenderView()}
                    {Object.keys(timeYPositions).length > 0 && Object.keys(expertAppointments).map((appointmentTime: any, index: number) => {
                        let times = appointmentTime.split("-");
                        let bc = appointmentColorCodes[expertAppointments[appointmentTime]["status"].slice(-1)[0]["status"]];
                        return (
                            <View key={index} style={[styles.appointmentView, { backgroundColor: bc, top: timeYPositions[times[0]], height: timeYPositions[times[1]] - timeYPositions[times[0]] }]}>
                                <View style={styles.appointmentFirstRow}>
                                    <Text style={{ fontWeight: "bold", maxWidth: '50%' }} ellipsizeMode="tail">{expertAppointments[appointmentTime]["guestName"]}</Text>
                                    <Text style={{ fontSize: FontSize.small }}>{timeIntervals[times[0]]}-{timeIntervals[times[1]]}</Text>
                                </View>
                                <Text ellipsizeMode="tail" numberOfLines={1} style={{ maxWidth: '60%' }}>{expertAppointments[appointmentTime]["expertAppointments"][0]["service"]}</Text>
                            </View>
                        );
                    })
                    }
                </ScrollView> :
                <View style={styles.loaderView}>
                    {staffObjects.length > 0 && <ActivityIndicator color={GlobalColors.blueLight} />}
                    <Text style={{ margin: 10, textAlign: 'center' }}>{staffObjects.length > 0 ? "Loading Calendar" : "No Expert available today\n Try other date"}</Text>
                </View>
            }
        </View>
    );
};

const styles = StyleSheet.create({
    appointmentFirstRow: {
        flexDirection: "row",
        width: '100%',
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 5
    },
    appointmentView: {
        position: 'absolute',
        zIndex: 1,
        left: '30%',
        width: '69%',
        marginLeft: 5,
        padding: 10,
        borderRadius: 2,
        borderWidth: 0.5
    },
    timeSlotView: {
        width: "30%",
        backgroundColor: GlobalColors.lightGray2,
        marginRight: 5
    },
    timeSlotText: {
        fontSize: 12,
        width: '90%',
        textAlign: 'center'
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
    loaderView: {
        justifyContent: "center",
        alignItems: "center",
        height: '80%'
    }

});

export default CalendarEntries;