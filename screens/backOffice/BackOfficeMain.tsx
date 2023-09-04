import React, { useState } from "react";
import { View } from "react-native";
import SwipeablePills from "../../components/SwipablePills";
import HomePage from "./homepage/HomePage";
import StaffManagement from "./staffMgmt/StaffManagementNavigation";
import CategoryNavigation from "./servicesAndProduct/CategoryNavigation";
import { useAppSelector } from "../../redux/Hooks";
import { selectShowBackOfficeCategories } from "../../redux/state/UIStates";

const BackOfficeMainScreen = ({ navigation }: any) => {
    const pillsData = ['Home Page', 'Services', 'Product', 'Staff Mgmt'];
    const showPills = useAppSelector(selectShowBackOfficeCategories);
    const [selectedPill, setSelectedPill] = useState<string>("Services");

    const onSelectedPillChange = (pill: string) => {
        setSelectedPill(pill);
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

    return (
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
            {showPills && <SwipeablePills pills={pillsData} selectedPill={selectedPill} onSelectPill={onSelectedPillChange} />}
            {renderSelectedPillView(selectedPill)}
        </View>
    )
};

export default BackOfficeMainScreen;