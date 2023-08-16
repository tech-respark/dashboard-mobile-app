import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useAppDispatch, useAppSelector } from "../../../redux/Hooks";
import { selectBranchId, selectStaffData, selectTenantId, setStaffData } from "../../../redux/state/UserStates";
import { setIsLoading } from "../../../redux/state/UIStates";
import { environment } from "../../../utils/Constants";
import { makeAPIRequest } from "../../../utils/Helper";
import Toast from "react-native-root-toast";
import { FontSize, GlobalColors, GradientButtonColor } from "../../../Styles/GlobalStyleConfigs";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useIsFocused } from "@react-navigation/native";

const StaffList = ({ navigation }: any) => {
    const isFocused = useIsFocused();
    const dispatch = useAppDispatch();
    const storeId = useAppSelector(selectBranchId);
    const tenantId = useAppSelector(selectTenantId);

    const [staffList, setStaffList] = useState<{ [key: string]: any }[]>([]);
    const [rolesData, setRolesData] = useState<{ [key: string]: any }[]>([]);

    const getStaffList = async () => {
        dispatch(setIsLoading({ isLoading: true }));
        let urlForStaff = environment.sqlBaseUri + `staffs/${tenantId}/${storeId}`;
        let responseStaff = await makeAPIRequest(urlForStaff, null, "GET");
        let urlForRoles = environment.sqlBaseUri + `ssroles/${tenantId}`;
        let responseRoles = await makeAPIRequest(urlForRoles, null, "GET");
        dispatch(setIsLoading({ isLoading: false }));
        if (responseStaff && responseRoles) {
            setStaffList(responseStaff);
            dispatch(setStaffData({staffData: responseStaff}));
            setRolesData(responseRoles);
        } else {
            Toast.show("No Data Found");
        }
    };

    useEffect(() => {
        if (isFocused) {
            getStaffList();
        }
    }, [isFocused]);

    return (
        <View style={{flex: 1, backgroundColor: '#fff'}}>
            {
                staffList.length > 0 ?
                    <ScrollView style={{ marginBottom: 0, padding: 10 }}>
                        {staffList.map((item: any, index: number) => (
                            <TouchableOpacity key={index} style={styles.itemView} onPress={() => {
                                navigation.navigate("AddOrUpdate", { selectedStaff: item, rolesData: rolesData });
                            }}>
                                <Text style={[{ fontSize: FontSize.medium, maxWidth: '70%' }, item.active ? {} : { color: 'gray' }]}>{item.firstName} {item.lastName}</Text>
                                <Ionicons name="chevron-forward-outline" size={25} style={{ marginRight: 5 }} color={GlobalColors.blue} />
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                    :
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ textAlign: 'center', fontSize: FontSize.large }}>No Staff Data Found</Text>
                    </View>
            }
            <TouchableOpacity style={{ marginHorizontal: 40, marginBottom: 30 }}
                onPress={() => {
                    navigation.navigate("AddOrUpdate", { rolesData: rolesData });
                }}
            >
                <LinearGradient
                    colors={GradientButtonColor}
                    style={styles.loginButton}
                    start={{ y: 0.0, x: 0.0 }}
                    end={{ y: 0.0, x: 1.0 }}
                >
                    <Text style={styles.addNewText}>Create New</Text>
                </LinearGradient>
            </TouchableOpacity>
        </View>
    )
};

export default StaffList;

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
        padding: 10,
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