import React, { useState } from "react";
import { View } from "react-native";
import SwipeablePills from "../../components/SwipablePills";
import { createStackNavigator } from "@react-navigation/stack";
import HomePage from "./homepage/HomePage";
import Services from "./services/Services";
import Product from "./product/Product";
import StaffManagement from "./staffMgmt/StaffManagement";

const Stack = createStackNavigator();


const BackOfficeMainScreen = ({ navigation }: any) => {
    const pillsData = ['Home Page', 'Services', 'Product', 'Staff Mgmt'];
    const [selectedPill, setSelectedPill] = useState<string>("Services");

    const onSelectedPillChange = (pill: string) => {
        setSelectedPill(pill);
    };

    const renderSelectedPillView = () => {
        switch (selectedPill) {
            case "Home Page":
                return <HomePage />
            case "Services":
                return <Services />
            case "Product":
                return <Product />
            case "Staff Mgmt":
                return <StaffManagement />
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
            <SwipeablePills pills={pillsData} selectedPill={selectedPill} onSelectPill={onSelectedPillChange} />
            {renderSelectedPillView()}
        </View>
    )
};

export default BackOfficeMainScreen;