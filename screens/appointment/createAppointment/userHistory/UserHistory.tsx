import { useIsFocused } from "@react-navigation/native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useAppDispatch, useAppSelector } from "../../../../redux/Hooks";
import { setShowUserProfileTopBar } from "../../../../redux/state/UIStates";
import { Ionicons } from "@expo/vector-icons";
import { GlobalColors } from "../../../../Styles/GlobalStyleConfigs";
import ProfileInfo from "./ProfileInfo";
import Orders from "./Orders";
import { environment } from "../../../../utils/Constants";
import { selectBranchId, selectTenantId } from "../../../../redux/state/UserStates";
import { makeAPIRequest, sleep } from "../../../../utils/Helper";
import Toast from "react-native-root-toast";
import LoadingState from "../../../../components/LoadingState";
import AboutUser from "./AboutUser";
import Membership from "./Membership";
import FamilyMembers from "./FamilyMembers";

const UserHistory = ({ navigation, route }: any) => {
    const storeId = useAppSelector(selectBranchId);
    const tenantId = useAppSelector(selectTenantId);

    const [selectedIndex, setSelectedIndex] = useState<number>(0);
    const [customerData, setCustomerData] = useState<{ [key: string]: any } | null>(null);
    const [orderHistory, setOrderHistory] = useState<{ [key: string]: any }[]>([]);
    const [loader, setLoader] = useState<boolean>(false);

    const userHistorySections = ["Profile Info", "Orders", "About User", "Membership", "Advance", "Due Balance", "Family Members"];
    const sectionIcons = ["person-outline", "receipt-outline", "information-circle-outline", "ribbon-outline", "cash-outline", "wallet-outline", "people-outline"];
    const sectionViewMap: { [key: string]: any } = {
        "Profile Info": <ProfileInfo customer={customerData!} setCustomer={setCustomerData}/>,
        "Orders": <Orders ordersHistory={orderHistory}/>,
        "About User": <AboutUser />,
        "Membership": <Membership customer={customerData!} setCustomer={setCustomerData}/>,
        "Advance": <AboutUser />,
        "Due Balance": <AboutUser />,
        "Family Members": <FamilyMembers customer={customerData!} setCustomer={setCustomerData}/>
    }

    const getUserData = async () => {
        const url = environment.guestUrl + `customers/userbyguestid?tenantId=${tenantId}&storeId=${storeId}&guestId=${route.params.customerId}`;
        let response = await makeAPIRequest(url, null, "GET");
        if (response) {
            setCustomerData(response);
        } else {
            Toast.show("Encountered issue", { backgroundColor: GlobalColors.error });
        }
    };

    const getUserOrdersHistory = async () => {
        const url = environment.appointmentUri + `sorder/tenantguest/${tenantId}/${route.params.customerId}`;
        let response = await makeAPIRequest(url, null, "GET");
        if (response) {
            setOrderHistory(response);
        }
    };

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: "User History",
            headerTitleAlign: 'left',
            headerLeft: () => (
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name={"chevron-back-outline"} size={20} style={{ marginHorizontal: 5, color: GlobalColors.blue }} />
                </TouchableOpacity>
            ),
        });
    }, [navigation]);

    useEffect(() => {
        setLoader(true);
        getUserData();
        getUserOrdersHistory();
        setLoader(false);
    }, []);
    return (
        <View style={styles.container}>
            <View style={styles.sectionScrollView}>
                <ScrollView horizontal showsHorizontalScrollIndicator >
                    {userHistorySections.map((sectionName: any, index: number) => (
                        <Pressable
                            key={index}
                            style={[styles.singleSectionView, index === selectedIndex && { borderBottomWidth: 2, borderColor: GlobalColors.blue }]}
                            onPress={() => { setSelectedIndex(index) }}
                        >
                            <Ionicons name={sectionIcons[index]} size={25} color={index === selectedIndex ? GlobalColors.blue : GlobalColors.grayDark} style={{ marginRight: 5 }} />
                            <Text style={{ color: index === selectedIndex ? "#000" : GlobalColors.grayDark }}>{sectionName}</Text>
                        </Pressable>
                    ))}
                </ScrollView>
            </View>
            {customerData ?
                sectionViewMap[userHistorySections[selectedIndex]]
                :
                <LoadingState loader={loader} />
            }
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: "#fff"
    },
    sectionScrollView: {
        backgroundColor: GlobalColors.lightGray2,
        width: '100%',
        height: '8%',
        marginBottom: 10,
    },
    singleSectionView: {
        flexDirection: 'row',
        justifyContent: "center",
        alignItems: "center",
        marginHorizontal: 5,
        paddingHorizontal: 10,
    },
});

export default UserHistory;