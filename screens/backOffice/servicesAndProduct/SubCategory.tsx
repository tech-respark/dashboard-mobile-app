import { Ionicons } from "@expo/vector-icons";
import React, { useLayoutEffect } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { FontSize, GlobalColors } from "../../../Styles/GlobalStyleConfigs";
import CategoryList from "./CategoryList";

const SubCategory = ({ navigation, route }: any) => {
    const selectedItem = route.params.selectedItem;
    const onTextClickHandler = (item: {[key: string]: any}) => {
        navigation.navigate("ItemList", {selectedItem: item, routeName: selectedItem.name+' / '+ item.name, type: route.params.type});
    };

    const editCategory = () => {};

    const addNew = () => { };

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: `${selectedItem.name} /`,
            headerTitleStyle: {
                fontWeight: '400',
                fontSize: FontSize.medium,
                color: GlobalColors.blue
              },
            headerTitleAlign: 'left',
            headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()} style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name={"ios-arrow-back"} size={20} style={{ marginHorizontal: 5 }} />
            </TouchableOpacity>
            ),
        });
    }, [navigation]);

    return (
        <View style={{flex: 1, backgroundColor: "#fff"}}>
            <CategoryList dataList={selectedItem.categoryList} onTextClickHandler={onTextClickHandler} editItemHandler={editCategory} buttonClickHandler={addNew} buttonText="Add New"/>
        </View>
    );
};


export default SubCategory;