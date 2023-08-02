import React, { FC } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { FontSize, GlobalColors, GradientButtonColor } from "../../../Styles/GlobalStyleConfigs";
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

type CategoryListType = {
    dataList: { [key: string]: any }[],
    onTextClickHandler: (item: { [key: string]: any }) => void,
    buttonClickHandler: () => void,
    editItemHandler: (item: { [key: string]: any }) => void,
    buttonText: string
}
const CategoryList: FC<CategoryListType> = ({ dataList, onTextClickHandler, buttonClickHandler, editItemHandler, buttonText }) => {
    return (
        <>
            {
                dataList.length > 0 ?
                    <ScrollView style={{ marginBottom: 0 }}>
                        {dataList.map((item: any, index: number) => (
                            <View key={index} style={styles.itemView}>
                                <Text style={[{ fontSize: FontSize.regular }, item.active ? {}: {color: 'gray'}]} onPress={()=>{onTextClickHandler(item)}}>{item.name}</Text>
                                <TouchableOpacity onPress={() => editItemHandler(item)}>
                                    <FontAwesome5 name="edit" size={20} style={{ marginRight: 10 }} color={GlobalColors.blueLight} />
                                </TouchableOpacity>
                            </View>
                        ))}
                    </ScrollView>
                    :
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ textAlign: 'center', fontSize: FontSize.large }}>No Data Found</Text>
                    </View>
            }
            <TouchableOpacity style={{ marginHorizontal: 40, marginBottom: 20 }}
                onPress={() => {buttonClickHandler}}
            >
                <LinearGradient
                    colors={GradientButtonColor}
                    style={styles.loginButton}
                    start={{ y: 0.0, x: 0.0 }}
                    end={{ y: 0.0, x: 1.0 }}
                >
                    <Text style={styles.addNewText}>{buttonText}</Text>
                    <MaterialIcons name="add" size={25} style={{ marginLeft: 20 }} color={"#fff"} />
                </LinearGradient>
            </TouchableOpacity>
        </>
    )
};


const styles = StyleSheet.create({
    itemView: {
        width: '100%',
        borderBottomWidth: 1,
        borderColor: 'lightgray',
        paddingVertical: 15,
        paddingHorizontal: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    loginButton: {
        padding: 8,
        borderRadius: 20,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    addNewText: {
        fontSize: FontSize.large,
        color: "#fff",
        textAlign: 'center',
        fontWeight: 'bold'
    }
});

export default CategoryList;