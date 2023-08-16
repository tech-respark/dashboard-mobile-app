import { Ionicons } from "@expo/vector-icons";
import React, { useLayoutEffect } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { GlobalColors } from "../../../Styles/GlobalStyleConfigs";

const AddUpdateService = ({navigation, route}: any) => {

    const isAdd = route.params.isAdd;
    const headerTitle = route.params.headerTitle 

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: `${headerTitle} / ${isAdd ? 'New Item' : route.params.selectedItem.name}`,
            headerTitleAlign: 'left',
            headerLeft: () => (
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name={"chevron-back-outline"} size={20} style={{ marginHorizontal: 5, color: GlobalColors.blue }} />
                </TouchableOpacity>
            ),
        });
    }, [navigation]);

    return (
        <View>
            <Text>Hello</Text>
        </View>
    )
};

const styles = StyleSheet.create({

});

export default AddUpdateService;
