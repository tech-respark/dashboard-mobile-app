import React, { FC, useState } from "react"
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Dropdown } from 'react-native-element-dropdown';
import { FontSize, GlobalColors } from "../Styles/GlobalStyleConfigs";

interface IDropdownApp {
    options: {[key: string]: any}[],
    labelKey: string,
    selectedItem: {[key: string]: any},
    setSelectedItem: (val: {[key: string]: any}) => void,
    renderItem?: View
}

const DropdownApp: FC<IDropdownApp> = ({options, selectedItem, setSelectedItem, labelKey}) => {
    return (
        <Dropdown
        style={styles.dropdown}
        placeholder="Hello"
        iconColor={GlobalColors.blue}
        selectedTextStyle={{color: '#fff', textTransform: 'capitalize'}}
        data={options}
        labelField={labelKey}
        valueField={labelKey}
        value={"Cancelled"}
        onChange={item => {
            setSelectedItem(item);
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
