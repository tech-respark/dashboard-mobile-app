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
    const data = [
        { label: 'Item 1', value: '1' },
        { label: 'Item 2', value: '2' },
        { label: 'Item 3', value: '3' },
        { label: 'Item 4', value: '4' },
        { label: 'Item 5', value: '5' },
        { label: 'Item 6', value: '6' },
        { label: 'Item 7', value: '7' },
        { label: 'Item 8', value: '8' },
      ];
      const [value, setValue] = useState<any>('hello');

    return (
        <Dropdown
        style={styles.dropdown}
        placeholder=""
        iconColor={GlobalColors.blue}
        selectedTextStyle={{color: '#fff', textTransform: 'capitalize'}}
        data={data}
        labelField='label'
        valueField='value'
        onChange={item => {
            setValue(item.value);
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
