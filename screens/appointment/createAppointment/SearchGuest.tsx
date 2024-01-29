import React, { FC, useEffect, useState } from "react";
import { Dimensions, Pressable, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { GlobalColors } from "../../../Styles/GlobalStyleConfigs";
import { TextInput } from "react-native-gesture-handler";
import { StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type SearchModalType = {
    customerData: { [key: string]: any }[],
    setSelectedCustomerIndex: (index: number) => void,
}

const SearchModal: FC<SearchModalType> = ({ customerData, setSelectedCustomerIndex }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [searchCustValue, setSearchCustValue] = useState<string>('');
    const [viewPosition, setViewPosition] = useState({ top: 0, left: 0, width: 0 });
    const [filteredList, setFilteredList] = useState<{ [key: string]: any }[]>([]);

    const windowHeight = Dimensions.get('window').height;

    const filterCustomerData = (searchTerm: string) => {
        const filteredData = customerData.filter(item => {
            return item.mobileNo.includes(searchTerm) || item.firstName.includes(searchTerm);
        });
        setFilteredList(filteredData);
    };

    useEffect(() => {
        if (customerData.length > 0) {
            setFilteredList(customerData)
        }
    }, [customerData])

    return (
        <>
            <Pressable style={[{ backgroundColor: GlobalColors.lightGray2, borderRadius: 2, marginTop: 20, padding: 5 }, styles.justifiedRow]}
                onPress={() => {
                    setModalVisible(true);
                }}
                onLayout={(event) => {
                    const layout = event.nativeEvent.layout;
                    console.log(layout)
                    setViewPosition({ top: layout.y, left: layout.x, width: layout.width });
                }}
            >
                <TextInput
                    style={styles.textInput}
                    placeholder="Search By Name Or Number"
                    value={searchCustValue}
                    placeholderTextColor="gray"
                    underlineColorAndroid="transparent"
                    onChangeText={(val) => {
                        setSearchCustValue(val);
                        filterCustomerData(val);
                    }}
                    onPressIn={() => { setModalVisible(true) }}
                />
                <Ionicons name='search-outline' size={25} />
            </Pressable>
            {
                modalVisible && <View style={[styles.modalView, { position: 'absolute', top: viewPosition.top + 40, left: viewPosition.left, width: viewPosition.width, height: 0.4 * windowHeight }]}>
                    <ScrollView>
                        {filteredList.map((item: { [key: string]: any }, index: number) => {
                            console.log(filteredList.length, customerData.length)
                            return (
                                <TouchableOpacity style={{ borderWidth: 0.5, borderColor: 'lightgray', marginHorizontal: 20, marginVertical: 5, padding: 10, borderRadius: 2 }}
                                    onPress={() => {
                                        setSelectedCustomerIndex(index);
                                        setSearchCustValue(item.firstName);
                                        setModalVisible(false);
                                    }}
                                >
                                    <Text>{item.firstName}, {item.mobileNo}</Text>
                                </TouchableOpacity>
                            )
                        })}
                    </ScrollView>
                </View>
            }

        </>
    );
};

const styles = StyleSheet.create({
    textInput: {
        paddingHorizontal: 10,
        zIndex: 5
    },
    justifiedRow: {
        flexDirection: "row",
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    modalView: {
        paddingVertical: 5,
        position: 'absolute',
        backgroundColor: '#fff',
        shadowColor: '#000000',
        shadowRadius: 4,
        shadowOffset: { height: 4, width: 0 },
        shadowOpacity: 0.5,
        borderRadius: 5,
    },
});

export default SearchModal;