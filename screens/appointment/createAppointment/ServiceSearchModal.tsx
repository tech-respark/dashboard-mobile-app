import React, { FC, useEffect, useState } from "react";
import { ActivityIndicator, Dimensions, Modal, Pressable, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { FontSize, GlobalColors } from "../../../Styles/GlobalStyleConfigs";
import { TextInput } from "react-native-gesture-handler";
import { StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { GlobalStyles } from "../../../Styles/Styles";
import { HeaderedComponent } from "../../../components/HeaderTextField";

type ServiceSearchModalType = {
    data: { [key: string]: any }[],
    headerText: string,
    setSelectedValue: (val: { [key: string]: any }) => void,
    selectedValue: string,
}

const ServiceSearchModal: FC<ServiceSearchModalType> = ({ data, selectedValue, setSelectedValue, headerText }) => {
    const type = "service"
    const [modalVisible, setModalVisible] = useState(false);
    const [search, setSearch] = useState<string>(selectedValue ?? "");
    const [clickedItem, setClickedItem] = useState<{ [key: string]: any } | null>(null);
    const [selectedGender, setSelectedGender] = useState<string>("Male");

    const checkTypeGender = (item: any) => {
        return item.type == type && (item.group == selectedGender.toLowerCase() || item.group == "both");
    }

    // solve issue of variation inside variation
    const renderServiceVariation = (isVariation: boolean, service: {[key: string]: any}, serviceCategory: string, serviceCategoryId: string, variation: any) => {
        let name = isVariation ? `${service.name} - ${variation.name}` : service.name;
        let currentObj = isVariation ? variation : service
        return (
            name.toLowerCase().includes(search.toLowerCase()) ?
                <TouchableOpacity key={currentObj.id} style={[styles.serviceItemView, clickedItem?.fullName == name && { backgroundColor: GlobalColors.blueLight, borderColor: GlobalColors.blue, borderWidth: 0.5 }]}
                    onPress={() => {
                        setSearch(name);
                        let item = {...service, serviceCategory: serviceCategory, serviceCategoryId: serviceCategoryId, variations: isVariation ? [variation] : null, fullName: name}
                        setClickedItem(item);
                    }}
                >
                    <Text style={{ fontWeight: '300', width: '80%' }}>{name}</Text>
                    <Text>₹{currentObj.salePrice !== 0 ? currentObj.salePrice : currentObj.price}</Text>
                </TouchableOpacity> : <View key={currentObj.id}></View>
        );
    };

    const renderService = (item: { [key: string]: any }, serviceCategoryId: string, serviceCategory: string) => {
        return (
            item?.map((service: any) => (
                service.active &&
                    service.variations.length > 0 ?
                        service.variations.map((variation: any, index: number) => (
                            renderServiceVariation(true, service, serviceCategory, serviceCategoryId, variation)
                        ))
                        :
                        renderServiceVariation(false, service, serviceCategory, serviceCategoryId, null)
            ))
        );
    };

    const renderServiceOptions = (item: any) => {
        return (item.categoryList?.length > 0) || (item.itemList?.length > 0) ?  
        (
            <View key={item.id} style={{ marginVertical: 5, width: '100%' }}>
                <Text style={{ fontWeight: '500', color: GlobalColors.blue }}>{item.name}</Text>
                {
                    item.categoryList?.length > 0 ? item.categoryList.map((cateogory: any, index: number) => (
                        checkTypeGender(cateogory) && cateogory.active && cateogory.itemList?.length > 0?
                            <View key={index} style={{ marginVertical: 5 }}>
                                <Text>{cateogory.name}</Text>
                                <View style={{ width: '100%', borderStyle: 'dotted', borderWidth: 0.5, borderColor: 'gray', marginVertical: 2 }} />
                                {renderService(cateogory.itemList, `${item.id} - ${cateogory.id}`, `${item.name} - ${cateogory.name}`)}
                            </View> : <View key={index}></View>
                    )) :
                        renderService(item.itemList, item.id, item.name)
                }
            </View>
        ) : <></>;
    };

    useEffect(() => {
        if (modalVisible) {
            setSearch(selectedValue ?? "");
            !selectedValue ? setClickedItem(null) : null;
        }
    }, [modalVisible])

    return (
        <>
            <Pressable style={{ marginVertical: 10 }} onPress={() => { setModalVisible(true) }}>
                <HeaderedComponent header={headerText}>
                    <View style={[GlobalStyles.justifiedRow, styles.searchView]}>
                        <Text style={{ color: selectedValue ? '#000' : 'gray', width: '85%' }} numberOfLines={1} ellipsizeMode="tail">{selectedValue ?? "Search Service by Name"}</Text>
                        {
                            selectedValue ? <Ionicons name="close" size={25} color={GlobalColors.grayDark}
                                onPress={() => {
                                    setSelectedValue({});
                                }} /> :
                                <Ionicons name={'search-outline'} size={25} color={GlobalColors.grayDark} />
                        }
                    </View>
                </HeaderedComponent>
            </Pressable>

            {
                modalVisible &&
                <Modal
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                        setModalVisible(!modalVisible);
                    }}>
                    <View style={[GlobalStyles.modalbackground]}>
                        <View style={[styles.modalView]}>
                            <Text style={styles.heading}>Select Service</Text>
                            <View style={[GlobalStyles.justifiedRow, styles.searchView, { width: '100%', marginBottom: 10 }]}>
                                <TextInput
                                    placeholder="Search Service by Name"
                                    value={search}
                                    placeholderTextColor="gray"
                                    onChangeText={setSearch}
                                />
                                {
                                    search ? <Ionicons name="close" size={25} color={GlobalColors.grayDark}
                                        onPress={() => {
                                            setSearch("");
                                            setClickedItem(null);
                                        }} /> :
                                        <Ionicons name={'search-outline'} size={25} color={GlobalColors.grayDark} />
                                }
                            </View>
                            <View style={{ flexDirection: 'row', marginVertical: 15, marginHorizontal: 10, width: '100%' }}>
                                {["Male", "Female"].map((gender: string) => (
                                    <TouchableOpacity key={gender} style={{ backgroundColor: gender == selectedGender ? GlobalColors.blue : GlobalColors.lightGray2, paddingHorizontal: 15, paddingVertical: 10, marginRight: 10, borderRadius: 5 }}
                                        onPress={() => { setSelectedGender(gender) }}>
                                        <Text style={{ color: gender == selectedGender ? '#fff' : '#000' }}>{gender}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                            {
                                data.length > 0 ?
                                    <ScrollView style={{ width: '100%' }} showsVerticalScrollIndicator>
                                        {
                                            data.map((item: { [key: string]: any }, index: number) => {
                                                return (
                                                    checkTypeGender(item) && item.active ?
                                                        <View key={index}>
                                                            {renderServiceOptions(item)}
                                                        </View> : <View key={index}></View>
                                                )
                                            })
                                        }
                                    </ScrollView> :
                                    <ActivityIndicator />
                            }
                            <View style={[GlobalStyles.justifiedRow, styles.buttonsView, { marginTop: 15 }]}>
                                <Pressable style={[styles.buttonContainer, { marginRight: 20, width: '30%' }]}
                                    onPress={() => { setModalVisible(false) }}>
                                    <Text style={styles.buttonText}>Close</Text>
                                </Pressable>
                                <Pressable style={[styles.buttonContainer, { backgroundColor: clickedItem ? GlobalColors.blue : 'lightgray', width: '30%', borderColor: clickedItem ? GlobalColors.blue : 'lightgray' }]}
                                    onPress={() => {
                                        console.log(clickedItem);
                                        setSelectedValue(clickedItem!);
                                        setModalVisible(false);
                                    }}
                                    disabled={!clickedItem}
                                >
                                    <Text style={[styles.buttonText, { color: '#fff' }]}>Add</Text>
                                </Pressable>
                            </View>
                        </View>
                    </View>
                </Modal>
            }

        </>
    );
};

const styles = StyleSheet.create({

    heading: {
        fontSize: FontSize.headingX,
        fontWeight: '500',
        marginBottom: 20,
        color: GlobalColors.blue
    },
    modalView: {
        width: '90%',
        height: '70%',
        margin: 5,
        backgroundColor: '#fff',
        borderRadius: 5,
        paddingVertical: 20,
        paddingHorizontal: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 2,
        shadowRadius: 5,
        elevation: 5,
    },
    searchView: {
        borderWidth: 0.5,
        borderColor: 'lightgray',
        borderRadius: 2,
        padding: 5,
        paddingLeft: 10
    },
    textInput: {
        backgroundColor: GlobalColors.lightGray2,
        borderWidth: 0.5,
        borderColor: 'lightgray',
        paddingHorizontal: 10,
        paddingVertical: 5,
        marginVertical: 10
    },
    buttonContainer: {
        borderWidth: 1,
        borderColor: GlobalColors.blue,
        borderRadius: 5,
    },
    buttonText: {
        fontSize: FontSize.large,
        textAlign: "center",
        paddingVertical: 5,
        color: GlobalColors.blue
    },
    buttonsView: {
        justifyContent: "flex-end",
        width: "100%",
        paddingTop: 15,
        borderTopColor: 'lightgray',
        borderTopWidth: 2
    },

    serviceItemView: {
        flexDirection: 'row',
        width: '100%',
        borderWidth: 1,
        borderColor: 'lightgray',
        padding: 10,
        justifyContent: 'space-between',
        borderRadius: 2,
        marginVertical: 3,
        elevation: 2,
        backgroundColor: '#fff',
        shadowColor: "black",
        shadowOffset: {
            width: 0,
            height: 0.2
        },
        shadowOpacity: 0.2,
        shadowRadius: 1
    }
});

export default ServiceSearchModal;