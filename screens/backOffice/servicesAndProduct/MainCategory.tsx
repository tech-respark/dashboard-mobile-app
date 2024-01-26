import React, { useEffect, useState } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { FontSize, GlobalColors, GradientButtonColor } from "../../../Styles/GlobalStyleConfigs";
import { environment } from "../../../utils/Constants";
import { useAppDispatch, useAppSelector } from "../../../redux/Hooks";
import { selectBranchId, selectTenantId } from "../../../redux/state/UserStates";
import { getCategoryData, makeAPIRequest } from "../../../utils/Helper";
import { setIsLoading } from "../../../redux/state/UIStates";
import Toast from "react-native-root-toast";
import CategoryList from "./CategoryList";
import { useIsFocused } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { selectCategoriesData, setCategoriesData } from "../../../redux/state/BackOfficeStates";

const MainCategory = ({ navigation, type }: any) => {
    const isFocused = useIsFocused();
    const dispatch = useAppDispatch();
    const storeId = useAppSelector(selectBranchId);
    const tenantId = useAppSelector(selectTenantId);
    const categoryList = useAppSelector(selectCategoriesData);

    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [clickedItem, setClickedItem] = useState<{ [key: string]: any }>({});
    const [loader, setLoader] = useState<boolean>(false);

    const onTextClickHandler = (item: { [key: string]: any }, index: number) => {
        if (item.categoryList.length > 0) {
            navigation.navigate("SubCategory", { type: type, topLevelObject: item, index: index })
        } else if (item.itemList.length > 0) {
            navigation.navigate("ItemList", { routeName: item.name, type: type, topLevelObject: item, categoryLevel: 1, categoryId: item.id, index: index });
        }
        else {
            setClickedItem(item);
            setModalVisible(true);
        }
    };

    const editCategory = (item: { [key: string]: any }) => {
        navigation.navigate("AddUpdateCategory", { type: type, isAddNew: false, categoryLevel: 1, item: item, categoryId: item.id });
    };

    const addNew = () => {
        navigation.navigate("AddUpdateCategory", { type: type, isAddNew: true, categoryLevel: 1, position: String(categoryList.length + 1) });
    };

    const onFocusHandler = async() => {
        setLoader(true);
        await getCategoryData(type, tenantId!, storeId!, dispatch);
        setLoader(false);
    }

    useEffect(() => {
        if (isFocused) {
            onFocusHandler() 
        }
    }, [isFocused]);



    return (
        <View style={{ padding: 10, flex: 1, backgroundColor: '#fff', opacity: modalVisible ? 0.5 : 1 }}>
            <Text style={{ fontSize: FontSize.large, fontWeight: 'bold', padding: 5 }}>Category</Text>
            <CategoryList dataList={categoryList} onTextClickHandler={onTextClickHandler} editItemHandler={editCategory} buttonClickHandler={addNew} buttonText="Add New" type={type} loader={loader}/>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text>There is no Subcategory or Item added to</Text>
                        <Text style={{ fontSize: FontSize.large, fontWeight: "bold", marginTop: 5, marginBottom: 5 }}>{clickedItem.name}</Text>
                        <LinearGradient
                            colors={GradientButtonColor}
                            style={styles.cancelButtom}
                            start={{ y: 0.0, x: 0.0 }}
                            end={{ y: 0.0, x: 1.0 }}
                        >
                            <TouchableOpacity onPress={() => {
                                navigation.navigate("AddUpdateCategory", { type: type, isAddNew: true, categoryLevel: 2, categoryId: clickedItem.id, categoryName: clickedItem.name, position: String(clickedItem.categoryList.length + 1) });
                                setModalVisible(false);
                            }} >
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={[styles.cancelButtonText, { color: '#fff' }]}>Add Subcategory</Text>
                                </View>
                            </TouchableOpacity>
                        </LinearGradient>
                        <LinearGradient
                            colors={GradientButtonColor}
                            style={styles.cancelButtom}
                            start={{ y: 0.0, x: 0.0 }}
                            end={{ y: 0.0, x: 1.0 }}
                        >
                            <TouchableOpacity onPress={() => {
                                if (type == "service") {
                                    navigation.navigate("AddUpdateItem", { isAdd: true, headerTitle: clickedItem.name, position: "1", categoryLevel: 1, categoryId: clickedItem.id });
                                    setModalVisible(false);
                                }
                            }} >
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={[styles.cancelButtonText, { color: '#fff' }]}>Add Item</Text>
                                </View>
                            </TouchableOpacity>
                        </LinearGradient>
                        <TouchableOpacity onPress={() => { setModalVisible(false) }} style={[styles.cancelButtom, { alignItems: 'center' }]}>
                            <Text style={[styles.cancelButtonText, { color: GlobalColors.blue }]}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal >
        </View >
    )
};

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 25,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    buttons: {
        flexDirection: "row",
        width: "100%",
        backgroundColor: 'red'
    },
    cancelButtom: {
        borderWidth: 1,
        paddingVertical: 8,
        borderRadius: 20,
        borderColor: GlobalColors.blue,
        marginVertical: 10,
        width: 200,
        alignItems: 'center'
    },
    cancelButtonText:
    {
        fontSize: FontSize.medium,
    },
});


export default MainCategory;