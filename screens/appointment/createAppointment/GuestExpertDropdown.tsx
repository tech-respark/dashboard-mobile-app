import React, { FC, useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Dropdown } from 'react-native-element-dropdown';
import { FontSize, GlobalColors } from "../../../Styles/GlobalStyleConfigs";
import { Ionicons } from "@expo/vector-icons";
import { HeaderedComponent } from "../../../components/HeaderTextField";

interface IGuestExpertDropdown {
    data: { [key: string]: any }[],
    placeholderText: string,
    headerText?: string,
    setSelected: (val: { [key: string]: any }) => void,
    selectedValue: string,
    type: string
}

const GuestExpertDropdown: FC<IGuestExpertDropdown> = ({ data, placeholderText, headerText, selectedValue, type, setSelected }) => {

    // const [filteredList, setFilteredList] = useState<{ [key: string]: any }[]>([]);

    // const filterData = (searchTerm: string) => {
    //     const filteredData = data.filter(item => {
    //         return item.mobileNo.includes(searchTerm) || item.firstName.includes(searchTerm);
    //     });
    //     setFilteredList(filteredData);
    // };

    return (
        <View style={styles.container}>
            <HeaderedComponent header={headerText}>
                <Dropdown
                    style={[styles.dropdown, type == "guest" ? { backgroundColor: GlobalColors.lightGray2 } : { borderColor: 'lightgray', borderWidth: 0.5, }]}
                    placeholderStyle={{ color: 'gray', fontSize: FontSize.regular }}
                    data={data}
                    search
                    maxHeight={300}
                    labelField={type=="guest" ? "firstName" : "name"}
                    valueField={type=="guest" ? "firstName" : "name"}
                    placeholder={placeholderText}
                    searchPlaceholder={"Search ..."}
                    value={selectedValue}
                    onChange={item => {
                        setSelected(item);
                    }}
                    renderRightIcon={() => (
                        <Ionicons
                            name={type == "guest" ? (selectedValue ? "close" : "search-outline") : "caret-down"}
                            color={type == "expert" ? GlobalColors.blue : GlobalColors.grayDark}
                            size={type == "expert" ? 15 : (selectedValue ? 20: 25)}
                            onPress={() => {
                                if (type == "guest" && selectedValue) {
                                    setSelected({});
                                }
                            }}
                        />
                    )}
                    renderItem={(item) => (
                        <View key={item.id} style={{ borderWidth: 0.5, borderColor: 'lightgray', marginHorizontal: 5, marginVertical: 4, padding: 10, borderRadius: 2 }}>
                            <Text>{type == 'expert' ? item.name : `${item.firstName} , ${item.mobileNo}`}</Text>
                        </View>
                    )}

                />
            </HeaderedComponent>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: 10
    },
    dropdown: {
        borderRadius: 2,
        paddingHorizontal: 10,
    },
});

export default GuestExpertDropdown;