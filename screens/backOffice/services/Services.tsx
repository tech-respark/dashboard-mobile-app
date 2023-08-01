import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { FontSize, GlobalColors, GradientButtonColor } from "../../../Styles/GlobalStyleConfigs";
import { environment } from "../../../utils/Constants";
import { useAppDispatch, useAppSelector } from "../../../redux/Hooks";
import { selectBranchId, selectTenantId } from "../../../redux/state/UserStates";
import { makeAPIRequest } from "../../../utils/Helper";
import { setIsLoading } from "../../../redux/state/UIStates";
import Toast from "react-native-root-toast";
import { ScrollView } from "react-native-gesture-handler";
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const Services = () => {
    const dispatch = useAppDispatch();

    const storeId = useAppSelector(selectBranchId);
    const tenantId = useAppSelector(selectTenantId);

    const [categoryList, setCategoryList] = useState<{ [key: string]: any }[]>([]);

    const getServiceCategoryData = async () => {
        dispatch(setIsLoading({ isLoading: true }));
        const url = environment.documentBaseUri + `/stores/getServiceCategoriesByTenantAndStore?tenantId=${tenantId}&storeId=${storeId}`;
        let response = await makeAPIRequest(url, null, "GET");
        dispatch(setIsLoading({ isLoading: false }));
        if (response) {
            //wil save to store later
            setCategoryList(response);
        } else {
            Toast.show("No Data Found");
        }
    };

    const editCategory = () => {

    };

    const addNew = () => { };

    useEffect(() => {
        getServiceCategoryData();
    }, [])
    return (
        <View style={{ padding: 10, flex: 1 }}>
            <Text style={{ fontSize: FontSize.large, fontWeight: 'bold', padding: 5 }}>Category</Text>
            {
                categoryList.length > 0 ?
                    <ScrollView style={{ marginBottom: 0 }}>
                        {categoryList.map((item: any, index: number) => (
                            <View key={index} style={styles.itemView}>
                                <Text style={{ fontSize: FontSize.regular }}>{item.name}</Text>
                                <TouchableOpacity onPress={() => editCategory()}>
                                    <FontAwesome5 name="edit" size={20} style={{ marginRight: 10 }} color={GlobalColors.blueLight} />
                                </TouchableOpacity>
                            </View>
                        ))}
                    </ScrollView>
                    :
                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                        <Text style={{ textAlign: 'center', fontSize: FontSize.large }}>No Data Found</Text>
                    </View>
            }
            <TouchableOpacity style={{ marginHorizontal: 40 , marginBottom: 20}}
                onPress={addNew}
            >
                <LinearGradient
                    colors={GradientButtonColor}
                    style={styles.loginButton}
                    start={{ y: 0.0, x: 0.0 }}
                    end={{ y: 0.0, x: 1.0 }}
                >
                    <Text style={styles.addNewText}>Add New</Text>
                    <MaterialIcons name="add" size={25} style={{ marginLeft: 20 }} color={"#fff"} />
                </LinearGradient>
            </TouchableOpacity>
        </View>
    )
};

const styles = StyleSheet.create({
    itemView: { width: '100%', borderBottomWidth: 1, borderColor: 'lightgray', paddingVertical: 15, paddingHorizontal: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
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
    // addNewIcon: {
    //     color
    // }
});

export default Services;