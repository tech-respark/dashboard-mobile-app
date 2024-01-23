import React, { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { GlobalColors } from "../../../Styles/GlobalStyleConfigs";
import { useAppSelector } from "../../../redux/Hooks";
import { selectCurrentStoreConfig, selectStaffData } from "../../../redux/state/UserStates";
import { TouchableOpacity } from "react-native-gesture-handler";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from "moment";

const AppointmentCalendar = () => {
    const staffList = useAppSelector(selectStaffData);
    const storeConfig = useAppSelector(selectCurrentStoreConfig);

    const [staffsNameList, setStaffNameList] = useState<string[]>([]);
    const [selectedStaffIndex, setSelectedStaffIndex] = useState<number>(0);
    const [timeIntervals, setTimeIntervals] = useState<string[]>([]);
    const [timeSlots, setTimeSlots] = useState<number[][]>([]);
    const [isDatePickerVisible, setIsDatePickerVisible] = useState<boolean>(false);
    const [selectedDate, setSelectedDate] = useState<string>(moment().format('DD/MM/YYYY'));

    const getTimeIntervalList = () => {
        const timeList = [];
        const start = new Date(`1970-01-01T${storeConfig!['startTime']}`);
        const end = new Date(`1970-01-01T${storeConfig!['closureTime']}`);
        while (start <= end) {
            const timeString = start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            timeList.push(timeString);
            start.setMinutes(start.getMinutes() + 15);
        }
        setTimeIntervals(timeList);
        return timeList;
    };

    const getTimeSlotsOfExperts = (timeIntervals: string[], staffs: string[]) => {
        const initialTimeSlots = Array.from({ length: staffs.length }, () => (
            Array.from({ length: timeIntervals.length }, () => 0)
        ));
        setTimeSlots(initialTimeSlots);
    };

    const handleDateConfirm = async (date: any) => {
        let selectedDate = moment(date).format("DD/MM/YYYY");
        setIsDatePickerVisible(false);
        setSelectedDate(selectedDate);
    };

    const handlePreviousNextDate = (isNext: boolean) => {
        const currentDate = moment(selectedDate, 'DD/MM/YYYY');
        const newDate = isNext ? currentDate.clone().add(1, 'days') : currentDate.clone().subtract(1, 'days');
        setSelectedDate(newDate.format('DD/MM/YYYY'));
    };

    useEffect(() => {
        if (staffList && storeConfig) {
            let staffNames = staffList!.map(item => `${item.firstName} ${item.lastName}`);
            setStaffNameList(staffNames);
            let intervals = getTimeIntervalList();
            getTimeSlotsOfExperts(intervals, staffNames);
        }
    }, [staffList, storeConfig])

    return (
        <View style={styles.container}>
            <View style={styles.dateView}>
                <View style={{ flexDirection: 'row', alignItems: "center", justifyContent: "center" }}>
                    <TouchableOpacity style={[styles.dateIcon, { marginRight: 10 }]} onPress={()=>handlePreviousNextDate(false)}>
                        <Ionicons name="chevron-back" color={GlobalColors.blue} size={20} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.dateIcon} onPress={()=>handlePreviousNextDate(true)}>
                        <Ionicons name="chevron-forward" color={GlobalColors.blue} size={20} />
                    </TouchableOpacity>
                    <Text style={{ marginHorizontal: 10 }}>{selectedDate}</Text>
                    <TouchableOpacity onPress={() => { setIsDatePickerVisible(true) }}>
                        <FontAwesome5 name="calendar-alt" size={20} color={GlobalColors.blue} />
                    </TouchableOpacity>
                    <DateTimePickerModal
                        isVisible={isDatePickerVisible}
                        mode="date"
                        onConfirm={async (date) => {
                            await handleDateConfirm(date);
                        }}
                        onCancel={() => setIsDatePickerVisible(false)}
                    />
                </View>
                <View style={{ borderWidth: 0.5, borderColor: 'lightgray', borderRadius: 2, paddingHorizontal: 10, justifyContent: 'center', alignContent: "center" }}>
                    <Text>Confirmed</Text>
                </View>
            </View>
            {/* Calender view */}
            <View style={styles.staffView}>
                <ScrollView horizontal showsHorizontalScrollIndicator >
                    {staffsNameList.map((staff: string, index: number) => (
                        <Pressable key={index} style={[styles.staffViewSingle, index == selectedStaffIndex && { borderBottomWidth: 2, borderColor: GlobalColors.blue }]}
                            onPress={() => { setSelectedStaffIndex(index) }}
                        >
                            <Text style={{ color: index == selectedStaffIndex ? "#000" : GlobalColors.grayDark }}>{staff}</Text>
                        </Pressable>
                    ))}
                </ScrollView>
            </View>
            <View style={{ width: '100%' }}>
                {timeSlots.length > 0 ?
                    <ScrollView showsVerticalScrollIndicator contentContainerStyle={{ paddingBottom: '35%' }}>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ backgroundColor: GlobalColors.lightGray2, marginRight: 5, width: '30%', paddingVertical: 0 }}>
                                {timeIntervals.map((time: string, index: number) => (
                                    <View style={{ paddingTop: index != 0 ? 22.5 : 0, paddingBottom: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }} key={index}>
                                        <Text key={index} style={{ fontSize: 12, width: '90%', textAlign: 'center' }}>{time}</Text>
                                        <View style={{ backgroundColor: 'gray', height: 1, width: '10%' }} />
                                    </View>
                                ))}
                            </View>
                            <View style={{ marginHorizontal: 2, width: '65%', marginVertical: 5 }}>
                                {timeSlots[selectedStaffIndex].map((value, timeIndex) => (
                                    <View key={timeIndex} style={styles.cell}>
                                        {value == 0 ?
                                            <Text style={{ color: 'gray' }}>Expert Unavailable</Text> :
                                            <Text></Text>
                                        }
                                    </View>
                                ))}
                            </View>
                        </View>
                    </ScrollView> :
                    <View style={{ justifyContent: "center", alignItems: "center", flex: 1 }}>
                        <ActivityIndicator color={GlobalColors.blueLight} />
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
    headerText: {
        fontWeight: 'bold',
    },
    row: {
        flexDirection: 'row',
    },
    rowHeaderText: {
        fontWeight: 'bold',
    },
    cellText: {
        textAlign: 'center',
    },
});

export default AppointmentCalendar;