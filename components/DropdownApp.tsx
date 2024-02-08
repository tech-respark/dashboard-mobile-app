import React, { FC } from "react"
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Dropdown } from 'react-native-element-dropdown';
import { FontSize, GlobalColors } from "../Styles/GlobalStyleConfigs";

interface IDropdownApp {
    options: {'label': string}[],
    selectedValue: string,
    setSelectedValue: (val: string) => void,
    renderItem?: View
}

const DropdownApp: FC<IDropdownApp> = ({options, selectedValue, setSelectedValue}) => {
    return (
        <Dropdown
        style={styles.dropdown}
        placeholder=""
        iconColor={GlobalColors.blue}
        selectedTextStyle={{color: '#fff', textTransform: 'capitalize'}}
        data={options}
        labelField="label"
        valueField="label"
        value={selectedValue}
        onChange={item => {
            setSelectedValue(item.label);
        }}
    />
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
        borderRadius: 5,
        paddingHorizontal: 10,
        justifyContent: 'center',
        alignContent: "center",
        borderWidth: 0.5, 
        borderColor: 'lightgray'
    },
});

export default DropdownApp;
