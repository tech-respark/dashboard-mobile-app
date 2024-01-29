import React, { FC, useState } from "react"
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { FontSize, GlobalColors } from "../../../Styles/GlobalStyleConfigs";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import moment from "moment";
import { Dropdown } from 'react-native-element-dropdown';
import DateTimePickerModal from "react-native-modal-datetime-picker";


type DateAndDropdownType = {
    selectedDate: string,
    setSelectedDate: (newDate: string) => void,
}

const DateAndDropdown: FC<DateAndDropdownType> = ({ selectedDate, setSelectedDate }) => {
    const data = [
        { label: 'Confirmed', number: 3 },
        { label: 'Online', number: 3 },
        { label: 'Future', number: 4 },
        { label: 'Completed', number: 1 },
        { label: 'Cancelled', number: 0 },
    ];

    const [selectedDropdown, setSelectedDropdown] = useState<{ label: string, number: number }>(data[0]);
    const [isDatePickerVisible, setIsDatePickerVisible] = useState<boolean>(false);

    const handlePreviousNextDate = (isNext: boolean) => {
        const currentDate = moment(selectedDate, 'YYYY-MM-DD');
        const newDate = isNext ? currentDate.clone().add(1, 'days') : currentDate.clone().subtract(1, 'days');
        setSelectedDate(newDate.format('YYYY-MM-DD'));
    };

    const handleDateConfirm = async (date: any) => {
        let selectedDate = moment(date).format("YYYY-MM-DD");
        setIsDatePickerVisible(false);
        setSelectedDate(selectedDate);
    };

    return (
        <View style={styles.dateView}>
            <View style={{ flexDirection: 'row', alignItems: "center", justifyContent: "center" }}>
                <TouchableOpacity style={[styles.dateIcon, { marginRight: 10 }]} onPress={() => handlePreviousNextDate(false)}>
                    <Ionicons name="chevron-back" color={GlobalColors.blue} size={20} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.dateIcon} onPress={() => handlePreviousNextDate(true)}>
                    <Ionicons name="chevron-forward" color={GlobalColors.blue} size={20} />
                </TouchableOpacity>
                <Text style={{ marginHorizontal: 10 }}>{moment(selectedDate, 'YYYY-MM-DD').format('DD/MM/YYYY')}</Text>
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
            <Dropdown
                style={styles.dropdown}
                data={data}
                labelField="label"
                valueField="label"
                value={selectedDropdown.label}
                onChange={item => {
                    setSelectedDropdown(item);
                }}
                renderRightIcon={() => (
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '30%' }}>
                        <Text style={{ paddingRight: 10, fontSize: FontSize.medium }}>{selectedDropdown.number}</Text>
                        <View style={{ backgroundColor: GlobalColors.lightGray2, borderRadius: 20 }}>
                            <Ionicons
                                name="caret-down"
                                color={GlobalColors.blue}
                                size={15}
                                style={{ padding: 4}}
                            />
                        </View>
                    </View>
                )}
                renderItem={(item) => (
                    <View style={{ paddingHorizontal: 10 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 0.5, borderColor: 'lightgray' }}>
                            <Text style={{ paddingRight: 10, fontSize: FontSize.medium, color: item.label == "Future" ? 'red' : 'gray' }}>{item.label}</Text>
                            <Text style={{ fontSize: FontSize.medium, color: item.label == "Future" ? 'red' : 'gray' }}>{item.number}</Text>
                        </View>
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
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

export default DateAndDropdown;