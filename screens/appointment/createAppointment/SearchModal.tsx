import React, { FC, useEffect, useState } from "react";
import { Dimensions, Pressable, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { GlobalColors } from "../../../Styles/GlobalStyleConfigs";
import { TextInput } from "react-native-gesture-handler";
import { StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { GlobalStyles } from "../../../Styles/Styles";
import { HeaderedComponent } from "../../../components/HeaderTextField";

type SearchModalType = {
    data: { [key: string]: any }[],
    placeholderText: string,
    type: string,
    headerText: string,
    setSelectedIndex?: (index: number) => void,
    selectedValue?: string,
}

const SearchModal: FC<SearchModalType> = ({ data, placeholderText, type, headerText, selectedValue='', setSelectedIndex }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [searchValue, setSearchValue] = useState<string>(selectedValue);
    const [viewPosition, setViewPosition] = useState({ top: 0, left: 0, width: 0 });
    const [filteredList, setFilteredList] = useState<{ [key: string]: any }[]>([]);

    const windowHeight = Dimensions.get('window').height;

    const filterData = (searchTerm: string) => {
        const filteredData = data.filter(item => {
            return item.mobileNo.includes(searchTerm) || item.firstName.includes(searchTerm);
        });
        setFilteredList(filteredData);
    };

    useEffect(() => {
        if (data.length > 0) {
            setFilteredList(data)
        }
    }, [data]);

    return (
        <>
            <Pressable style={{ marginVertical: 10 }} onPress={() => { setModalVisible(true); }}
                onLayout={(event) => {
                    const layout = event.nativeEvent.layout;
                    setViewPosition({ top: layout.y, left: layout.x, width: layout.width });
                }}
            >
                <HeaderedComponent header={headerText}>
                    <View style={[{ borderRadius: 2, padding: 5 }, GlobalStyles.justifiedRow, type == 'customer' ? { backgroundColor: GlobalColors.lightGray2 } : { borderWidth: 0.5, borderColor: 'lightgray' }]}>
                        <TextInput
                            style={styles.textInput}
                            placeholder={placeholderText}
                            value={searchValue}
                            placeholderTextColor="gray"
                            underlineColorAndroid="transparent"
                            onChangeText={(val) => {
                                setSearchValue(val);
                                filterData(val);
                            }}
                            onPressIn={() => { setModalVisible(true) }}
                        />
                        <Ionicons name={type=="expert" ? 'caret-down': 'search-outline'} size={type=="expert" ? 15 : 25} color={type=="expert" ? GlobalColors.blue : ''} style={type=="expert" && {padding: 5}}/>
                    </View>
                </HeaderedComponent>
            </Pressable>

            {
                modalVisible && 
                <View style={styles.modalContainer}>
                <Pressable style={[styles.backdrop, {height: windowHeight}]} onPress={()=>setModalVisible(false)} />
                <View style={[styles.modalView, { top: viewPosition.top + 40, left: viewPosition.left, width: viewPosition.width, height: 0.4 * windowHeight }]}>
                    <ScrollView>
                        {filteredList.map((item: { [key: string]: any }, index: number) => (
                            type == "service" ?
                                <View>
                                    <Text>Hello</Text>
                                </View> :
                                <TouchableOpacity key={item.id} style={{ borderWidth: 0.5, borderColor: 'lightgray', marginHorizontal: 20, marginVertical: 5, padding: 10, borderRadius: 2 }}
                                    onPress={() => {
                                        setSelectedIndex!(index);
                                        setSearchValue(type=='expert' ? item.name : item.firstName);
                                        setModalVisible(false);
                                    }}
                                >
                                    <Text>{type=='expert' ? item.name : `${item.firstName} , ${item.mobileNo}`}</Text>
                                </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
                </View>
            }

        </>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1,
    },
    backdrop: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    textInput: {
        paddingHorizontal: 10,
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