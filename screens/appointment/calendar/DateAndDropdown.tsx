import React, { FC, useEffect, useState } from "react"
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { FontSize, GlobalColors } from "../../../Styles/GlobalStyleConfigs";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import moment from "moment";
import { Dropdown } from 'react-native-element-dropdown';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { APPOINTMENT_CANCELLED, APPOINTMENT_COMPLETED, APPOINTMENT_CONFIRMED, APPOINTMENT_FUTURE, APPOINTMENT_ONLINE, APPOINTMENT_TOTAL } from "../../../utils/Constants";


type DateAndDropdownType = {
    data: { [key: string]: number },
    selectedDropdown: string,
    setSelectedDropdown: (val: string) => void,
    selectedDate: string,
    setSelectedDate: (newDate: string) => void,
}

const DateAndDropdown: FC<DateAndDropdownType> = ({ selectedDate, setSelectedDate, data, selectedDropdown, setSelectedDropdown }) => {

    const [isDatePickerVisible, setIsDatePickerVisible] = useState<boolean>(false);

    const options = [{ label: APPOINTMENT_CONFIRMED }, { label: APPOINTMENT_ONLINE }, { label: APPOINTMENT_FUTURE }, { label: APPOINTMENT_COMPLETED }, { label: APPOINTMENT_CANCELLED }, { label: APPOINTMENT_TOTAL }];

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
                    <Ionicons name="chevron-back" color={GlobalColors.blue} size={25} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.dateIcon} onPress={() => handlePreviousNextDate(true)}>
                    <Ionicons name="chevron-forward" color={GlobalColors.blue} size={25} />
                </TouchableOpacity>
                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => { setIsDatePickerVisible(true) }}>
                    <Text style={{ marginHorizontal: 10 }}>{moment(selectedDate, 'YYYY-MM-DD').format('DD/MM/YYYY')}</Text>
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
            <View style={{ width: '40%' }}>
                <Dropdown
                    style={[styles.dropdown]}
                    selectedTextStyle={{ color: '#fff', textTransform: 'capitalize' }}
                    data={options}
                    labelField="label"
                    valueField="label"
                    value={selectedDropdown}
                    onChange={item => {
                        setSelectedDropdown(item.label);
                    }}
                    renderRightIcon={() => (
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '35%' }}>
                            <Text style={{ fontSize: FontSize.medium, color: '#fff' }} ellipsizeMode="clip">{data[selectedDropdown] ?? 0}</Text>
                            <View style={{ backgroundColor: '#fff', borderRadius: 20 }}>
                                <Ionicons name="caret-down" color={GlobalColors.blue} size={15} style={{ padding: 4 }}/>
                            </View>
                        </View>
                    )}
                    renderItem={(item) => (
                        <View style={{ paddingHorizontal: 10 }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 0.5, borderColor: 'lightgray' }}>
                                <Text style={{ paddingRight: 10, fontSize: FontSize.medium, color: (item.label == APPOINTMENT_ONLINE && data[item.label] > 0) ? 'red' : 'gray', textTransform: 'capitalize' }}>{item.label}</Text>
                                <Text style={{ fontSize: FontSize.medium, color: (item.label == APPOINTMENT_ONLINE && data[item.label] > 0) ? 'red' : 'gray' }}>{data[item.label] ?? 0}</Text>
                            </View>
                        </View>
                    )}
                />
                {data[APPOINTMENT_ONLINE] > 0 && <View style={{ backgroundColor: 'red', width: 12, height: 12, borderRadius: 20, position: 'absolute', top: -5, right: -2 }}></View>}

            </View>
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
        borderRadius: 20
    },
    dropdown: {
        backgroundColor: GlobalColors.blue,
        borderRadius: 5,
        paddingHorizontal: 10,
        justifyContent: 'center',
        alignContent: "center",
    },
});

export default DateAndDropdown;