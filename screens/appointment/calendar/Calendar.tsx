import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { GlobalStyles } from "../../../Styles/Styles";
import { GlobalColors } from "../../../Styles/GlobalStyleConfigs";
import { useAppSelector } from "../../../redux/Hooks";
import { selectStaffData } from "../../../redux/state/UserStates";

const AppointmentCalendar = () => {
    const staffList = useAppSelector(selectStaffData);
    const staffsNameList = staffList!.map(item => `${item.firstName} ${item.lastName}`);

    const time = ["08:00 AM", "08:15 AM", "08:30 AM", "08:45 AM", "09:00 AM", "09:15 AM", "09:30 AM", "09:45 AM", "10:00 AM", "10:15 AM", "10:30 AM", "10:45 AM", "11:00 AM", "11:15 AM", "11:30 AM", "11:45 AM", "12:00 PM", "12:15 PM", "12:30 PM", "12:45 PM", "01:00 PM", "01:15 PM", "01:30 PM", "01:45 PM", "02:00 PM", "02:15 PM", "02:30 PM", "02:45 PM", "03:00 PM", "03:15 PM", "03:30 PM", "03:45 PM", "04:00 PM", "04:15 PM", "04:30 PM", "04:45 PM", "05:00 PM", "05:15 PM", "05:30 PM", "05:45 PM", "06:00 PM", "06:15 PM", "06:30 PM", "06:45 PM", "07:00 PM", "07:15 PM", "07:30 PM", "07:45 PM", "08:00 PM", "08:15 PM", "8:30 PM", "08:45 PM", "09:00 PM", "09:15 PM", "09:30 PM", "09:45 PM", "10:00 PM", "10:15 PM", "10:30 PM", "10:45 PM", "11:00 PM"]
    const initialTimeSlots = Array.from({ length: staffsNameList.length }, () => (
        Array.from({ length: time.length }, () => 0)
    ));
    const [timeSlots, setTimeSlots] = useState<number[][]>(initialTimeSlots);

    return (
        <View style={GlobalStyles.whiteContainer}>
            <View style={{ width: '90%', height: '15%', borderColor: 'gray', backgroundColor: GlobalColors.lightGray2, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Date and Tabs</Text>
            </View>
            <ScrollView showsVerticalScrollIndicator showsHorizontalScrollIndicator>
                <View style={{ backgroundColor: GlobalColors.lightGray2, flexDirection: 'row', margin: 10 }}>
                    <View style={{ backgroundColor: 'black', paddingTop: 50, marginRight: 5, width: 90 }}>
                        {time.map((time: string, index: number) => (
                            <View style={{ paddingHorizontal: 10, paddingVertical: 15, borderColor: 'gray', borderWidth: 1 }}>
                                <Text key={index} style={{ color: '#fff' }}>{time}</Text>
                            </View>
                        ))}
                    </View>
                    <View>
                        <View style={{ flexDirection: 'row', height: 50 }}>
                            {staffsNameList.map((staff: string, index: number) => (
                                <View key={index} style={{ backgroundColor: 'black', marginHorizontal: 2, width: 150, justifyContent: "center", alignItems: 'center' }}>
                                    <Text style={{ color: '#fff' }}>{staff}</Text>
                                </View>
                            ))}
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            {staffsNameList.map((staffName, staffIndex) => (
                                <View key={staffIndex} style={{ width: 150, marginHorizontal: 2 }}>
                                    {timeSlots[staffIndex].map((value, timeIndex) => (
                                        <View key={timeIndex} style={styles.cell}>
                                            {value == 0 ?
                                                <Text style={{color: 'gray'}}>Expert Unavailable</Text> :
                                                <Text></Text>
                                            }
                                        </View>
                                    ))}
                                </View>
                            ))}
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    )
};

const styles = StyleSheet.create({
    cell: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ccc',
        paddingVertical: 15,
        alignItems: 'center',
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