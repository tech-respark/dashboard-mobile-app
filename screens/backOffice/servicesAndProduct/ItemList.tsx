import React, { useLayoutEffect, useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import CategoryList from "./CategoryList";
import { Ionicons } from "@expo/vector-icons";
import { FontSize, GlobalColors } from "../../../Styles/GlobalStyleConfigs";


const ItemList = ({ navigation, route }: any) => {
    const topLevelObject = route.params.topLevelObject;
    const selectedItem = route.params.selectedItem;
    const routeName = route.params.routeName;
    const type = route.params.type;

    const [searchText, setSearchText] = useState<string>('');
    const [filteredItems, setFilteredItems] = useState<{ [key: string]: any }[]>(selectedItem.itemList);

    const onSearchChange = (text: string) => {
        setSearchText(text);
        const filtered = selectedItem.itemList.filter((item: any) =>
            item.name.toLowerCase().includes(text.toLowerCase())
        );
        setFilteredItems(filtered);
    };

    const editCategory = (item: { [key: string]: any }) => {
        if(type=="service"){
            navigation.navigate("AddUpdateService", {isAdd: false, clickedItem: item, headerTitle: routeName, ...route.params})
        }
     };

    const addNew = () => { 
        if(type=="service"){
            navigation.navigate("AddUpdateService", {isAdd: true, headerTitle: routeName, position: String(selectedItem.itemList.length+1), ...route.params})
        }
    };

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitleAlign: 'left',
            headerTitle: `${routeName} / Items`,
            headerTitleStyle: {
                fontWeight: '400',
                fontSize: FontSize.medium,
                color: GlobalColors.blue
            },
            headerLeft: () => (
                <TouchableOpacity onPress={() => navigation.goBack()} style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Ionicons name={"ios-arrow-back"} size={20} style={{ marginHorizontal: 5 }} />
                </TouchableOpacity>
            ),
        });
    }, [navigation]);

    return (
        <View style={{ flex: 1, backgroundColor: "#fff" }}>
            <View style={styles.searchView}>
                <Ionicons name="search" size={20} color={GlobalColors.blue} style={{ marginRight: 10 }} />
                <TextInput
                    placeholder="Search Items"
                    value={searchText}
                    onChangeText={onSearchChange}
                />
            </View>
            <CategoryList dataList={filteredItems} onTextClickHandler={editCategory} editItemHandler={editCategory} buttonClickHandler={addNew} buttonText="Add Service" type={type} topLevelObject={topLevelObject}/>
        </View>
    );
};

const styles = StyleSheet.create({
    searchView: {
        width: '90%',
        alignSelf: 'center',
        margin: 15,
        paddingHorizontal: 10,
        paddingVertical: 10,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: GlobalColors.lightGray2
    }
});
export default ItemList;