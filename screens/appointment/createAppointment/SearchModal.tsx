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
    setSelected?: (val: {[key:string]: any}) => void,
    selectedValue?: string,
    setModal: (val: 'guest'| 'service') => void,
}

const SearchModal: FC<SearchModalType> = ({ data, placeholderText, type, headerText, selectedValue = '', setSelected, setModal }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [searchValue, setSearchValue] = useState<string>(selectedValue);
    const [viewPosition, setViewPosition] = useState({ top: 0, left: 0, width: 0 });
    const [filteredList, setFilteredList] = useState<{ [key: string]: any }[]>([]);

    const [selectedGender, setSelectedGender] = useState<string>('Male');

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

    const renderServiceItem = (item: {[key: string]: any}) => {
        return (
            item?.map((service: any, serviceIndex: number) => (
                <TouchableOpacity key={serviceIndex} style={{flexDirection: 'row', width: '100%', borderWidth: 1, borderColor: 'lightgray', padding: 10, justifyContent: 'space-between', borderRadius: 2, marginVertical: 5, elevation: 2, backgroundColor: '#fff', shadowColor: "black", shadowOffset: { width: 0, height: 0.2 }, shadowOpacity: 0.2, shadowRadius: 1}}
                onPress={() => {
                    //set value to later remind selected data
                    setSearchValue(service.name);
                    setModalVisible(false);
                }}
                >
                    <Text style={{fontWeight: '300'}}>{service.name}</Text>
                    <Text>₹{service.price}</Text>
                </TouchableOpacity>
            ))
        );
    };

    const renderServiceOptions = (item: any) => {
        return (
            <View key={item.id} style={{marginVertical: 5, marginHorizontal: 15}}>
                <Text style={{fontWeight: 'bold'}}>{item.name}</Text>
                {
                    item.categoryList && item.categoryList.length > 0 ? item.categoryList.map((cateogory: any, index: number) => (
                        <View key={index} style={{marginVertical: 5}}>
                            <Text>{cateogory.name}</Text>
                            <View style={{width: '100%', borderStyle: 'dotted', borderWidth: 0.5, borderColor: 'gray', marginVertical: 2}}/>
                            {renderServiceItem(cateogory.itemList)}
                        </View>
                    )) : 
                    renderServiceItem(item.itemList)
                }
            </View>
        );
    };

    return (
        <>
            <Pressable style={{ marginVertical: 10 }} onPress={() => { setModalVisible(true); setModal(type=='customer' ? 'guest' : 'service') }}
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
                                val=="" ? setSelected!({}) : null;
                            }}
                            onPressIn={() => { setModalVisible(true) }}
                        />
                        {
                            searchValue && type != "expert" ? <Ionicons name="close" size={25} color={GlobalColors.grayDark} 
                            onPress={()=>{
                                setSearchValue(""); 
                                setSelected!({});
                            }}/> :
                            <Ionicons name={type == "expert" ? 'caret-down' : 'search-outline'} size={type == "expert" ? 15 : 25} color={type == "expert" ? GlobalColors.blue : GlobalColors.grayDark} style={type == "expert" && { padding: 5 }} />
                        }
                    </View>
                </HeaderedComponent>
            </Pressable>

            {
                modalVisible &&
                <View style={styles.modalContainer}>
                    <Pressable style={[styles.backdrop, { height: windowHeight }]} onPress={() => setModalVisible(false)} />
                    <View style={[styles.modalView, { top: viewPosition.top + 40, left: viewPosition.left, width: viewPosition.width, height: 0.4 * windowHeight }]}>
                        {type == 'service' &&
                            <View style={{ flexDirection: 'row', marginVertical: 15, marginHorizontal: 10 }}>
                                {["Male", "Female"].map((gender: string) => (
                                    <TouchableOpacity style={{ backgroundColor: gender == selectedGender ? GlobalColors.blue : GlobalColors.lightGray2, paddingHorizontal: 15, paddingVertical: 10, marginRight: 10, borderRadius: 5 }}
                                        onPress={() => { setSelectedGender(gender) }}>
                                        <Text style={{ color: gender == selectedGender ? '#fff' : '#000' }}>{gender}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        }
                        <ScrollView>
                            {
                            filteredList.map((item: { [key: string]: any }, index: number) => (
                                type == "service" ?
                                    renderServiceOptions(item)
                                    :
                                    <TouchableOpacity key={item.id} style={{ borderWidth: 0.5, borderColor: 'lightgray', marginHorizontal: 20, marginVertical: 5, padding: 10, borderRadius: 2 }}
                                        onPress={() => {
                                            setSelected!(data[index]);
                                            setSearchValue(type == 'expert' ? item.name : item.firstName);
                                            setModalVisible(false);
                                        }}
                                    >
                                        <Text>{type == 'expert' ? item.name : `${item.firstName} , ${item.mobileNo}`}</Text>
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