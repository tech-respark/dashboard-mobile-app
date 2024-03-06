import React, { FC } from "react"
import { StyleSheet, View } from "react-native";
import { Dropdown } from 'react-native-element-dropdown';
import { GlobalColors } from "../Styles/GlobalStyleConfigs";

interface ICustomDropdown2 {
    options: {[key: string]: any}[],
    labelKey: string,
    setSelectedItem: (val: {[key: string]: any}) => void,
    selectedValue: string
}

const CustomDropdown2: FC<ICustomDropdown2> = ({options, setSelectedItem, labelKey, selectedValue}) => {
    return (
        <Dropdown
        style={styles.dropdown}
        placeholder=""
        iconColor={GlobalColors.blue}
        selectedTextStyle={{textTransform: 'capitalize'}}
        data={options}
        value={selectedValue}
        labelField={labelKey}
        valueField={labelKey}
        onChange={item => {
            setSelectedItem(item);
        }}
    />
    );
};

const styles = StyleSheet.create({
    dropdown: {
        borderRadius: 5,
        paddingHorizontal: 10,
        justifyContent: 'center',
        alignContent: "center",
        borderWidth: 0.5, 
        borderColor: 'lightgray'
    },
});

export default CustomDropdown2;
