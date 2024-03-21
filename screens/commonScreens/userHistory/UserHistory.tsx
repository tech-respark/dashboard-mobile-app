import React, { useEffect, useLayoutEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useAppDispatch, useAppSelector } from "../../../redux/Hooks";
import { Ionicons } from "@expo/vector-icons";
import { GlobalColors } from "../../../Styles/GlobalStyleConfigs";
import ProfileInfo from "./ProfileInfo";
import Orders from "./Orders";
import { environment } from "../../../utils/Constants";
import { selectBranchId, selectTenantId } from "../../../redux/state/UserStates";
import { makeAPIRequest } from "../../../utils/Helper";
import LoadingState from "../../../components/LoadingState";
import AboutUser from "./AboutUser";
import Membership from "./membership/Membership";
import FamilyMembers from "./FamilyMembers";
import AdvanceOrBalance from "./AdvanceOrBalance";
import Packages from "./Packages";
import { selectSelectedGuest, setSelectedGuest } from "../../../redux/state/AppointmentStates";

const UserHistory = ({ navigation, route }: any) => {
    const dispatch = useAppDispatch();
    const storeId = useAppSelector(selectBranchId);
    const tenantId = useAppSelector(selectTenantId);
    const customerData = useAppSelector(selectSelectedGuest);
    
    const [selectedIndex, setSelectedIndex] = useState<number>(0);
    const [orderHistory, setOrderHistory] = useState<{ [key: string]: any }[]>([]);
    const [loader, setLoader] = useState<boolean>(false);

    const userHistorySections = ["Profile Info", "Orders", "About User", "Membership", "Advance", "Due Balance", "Family Members", "Packages"];
    const sectionIcons = ["person-outline", "receipt-outline", "information-circle-outline", "ribbon-outline", "cash-outline", "wallet-outline", "people-outline", "basket-outline"];
    
    const setCustomerData = (val: {[key: string]: any}) => {
        dispatch(setSelectedGuest({selectedGuest: val}));
    }
    const sectionViewMap: { [key: string]: any } = {
        "Profile Info": <ProfileInfo customer={customerData!} setCustomer={setCustomerData}/>,
        "Orders": <Orders ordersHistory={orderHistory}/>,
        "About User": <AboutUser customer={customerData!} setCustomer={setCustomerData}/>,
        "Membership": <Membership customer={customerData!} setCustomer={setCustomerData}/>,
        "Advance": <AdvanceOrBalance isAdvance={true} customer={customerData!} setCustomer={setCustomerData}/>,
        "Due Balance": <AdvanceOrBalance isAdvance={false} customer={customerData!} setCustomer={setCustomerData}/>,
        "Family Members": <FamilyMembers customer={customerData!} setCustomer={setCustomerData}/>,
        "Packages": <Packages customer={customerData!} setCustomer={setCustomerData} />
    };

    const getUserOrdersHistory = async () => {
        const url = environment.txnUrl + `sorder/tenantguest/${tenantId}/${customerData!.id}`;
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