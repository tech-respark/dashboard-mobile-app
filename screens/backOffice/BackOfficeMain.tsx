import React, { useEffect, useState } from "react";
import { View } from "react-native";
import SwipeablePills from "../../components/SwipablePills";
import { createStackNavigator } from "@react-navigation/stack";
import HomePage from "./homepage/HomePage";
import StaffManagement from "./staffMgmt/StaffManagementNavigation";
import CategoryNavigation from "./servicesAndProduct/CategoryNavigation";
import { useAppDispatch, useAppSelector } from "../../redux/Hooks";
import { selectBranchId, selectTenantId, setStaffData } from "../../redux/state/UserStates";
import { selectShowBackOfficeCategories, setIsLoading } from "../../redux/state/UIStates";
import { environment } from "../../utils/Constants";
import { makeAPIRequest } from "../../utils/Helper";

const Stack = createStackNavigator();


const BackOfficeMainScreen = ({ navigation }: any) => {
    const pillsData = ['Home Page', 'Services', 'Product', 'Staff Mgmt'];
    const dispatch = useAppDispatch();
    const storeId = useAppSelector(selectBranchId);
    const tenantId = useAppSelector(selectTenantId);
    const showPills = useAppSelector(selectShowBackOfficeCategories);
    const [selectedPill, setSelectedPill] = useState<string>("Services");

    const onSelectedPillChange = (pill: string) => {
        setSelectedPill(pill);
    };

    const getStaffDetails = async () => {
        dispatch(setIsLoading({ isLoading: true }));
        let url = environment.sqlBaseUri + `staffs/${tenantId}/${storeId}`;
        let responseStaff = await makeAPIRequest(url, null, "GET");
        dispatch(setIsLoading({ isLoading: false }));
        if (responseStaff) {
            dispatch(setStaffData({ staffData: responseStaff }));
        }
    };

    const renderSelectedPillView = (pill: any) => {
        switch (pill) {
            case "Home Page":
                return <HomePage />
            case "Services":
                return <CategoryNavigation type={"service"} navigation={navigation} />
            case "Product":
                return <CategoryNavigation type={"product"} navigation={navigation} />
            case "Staff Mgmt":
                return <StaffManagement />
        }
    };

    useEffect(() => {
        getStaffDetails();
    }, []);

    return (
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
            {showPills && <SwipeablePills pills={pillsData} selectedPill={selectedPill} onSelectPill={onSelectedPillChange} />}
            {renderSelectedPillView(selectedPill)}
        </View>
    )
};

export default BackOfficeMainScreen;