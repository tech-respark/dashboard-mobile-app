import React, { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";
import { GlobalStyles } from "../../../Styles/Styles";
import { GlobalColors } from "../../../Styles/GlobalStyleConfigs";
import { useAppSelector } from "../../../redux/Hooks";
import { selectCurrentStoreConfig, selectStaffData } from "../../../redux/state/UserStates";

const AppointmentCalendar = () => {
    const staffList = useAppSelector(selectStaffData);
    const storeConfig = useAppSelector(selectCurrentStoreConfig);

    const [staffsNameList, setStaffNameList] = useState<string[]>([]);
    const [timeIntervals, setTimeIntervals] = useState<string[]>([]);
    const [timeSlots, setTimeSlots] = useState<number[][]>([]);

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

    useEffect(()=>{
        if(staffList && storeConfig){
            let staffNames = staffList!.map(item => `${item.firstName} ${item.lastName}`);
            setStaffNameList(staffNames);
            let intervals = getTimeIntervalList();
            getTimeSlotsOfExperts(intervals, staffNames);
        }
    }, [staffList, storeConfig])


    return (
        <View style={GlobalStyles.whiteContainer}>
            <View style={{ width: '90%', height: '15%', borderColor: 'gray', backgroundColor: GlobalColors.lightGray2, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Date and Tabs</Text>
            </View>
            { timeSlots.length > 0 ? 
            <ScrollView showsVerticalScrollIndicator showsHorizontalScrollIndicator stickyHeaderIndices={[1]}>
                <View style={{ backgroundColor: GlobalColors.lightGray2, flexDirection: 'row', margin: 10 }}>
                    <View style={{ backgroundColor: 'black', paddingTop: 50, marginRight: 5, width: 90 }}>
                        {timeIntervals.map((time: string, index: number) => (
                            <View style={{ paddingHorizontal: 10, paddingVertical: 15, borderColor: 'gray', borderWidth: 1 }} key={index}>
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
            </ScrollView> : 
            <View style={{justifyContent: "center", alignItems: "center", flex: 1}}>
                <ActivityIndicator color={GlobalColors.blueLight}/>
            </View>
}
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