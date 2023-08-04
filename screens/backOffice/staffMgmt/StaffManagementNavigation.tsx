import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import StaffList from "./StaffList";
import AddOrUpdate from "./AddOrUpdate";

const Stack = createStackNavigator();

const StaffManagementNavigation = ({navigation}: any) => {
        return (
            <Stack.Navigator initialRouteName="StaffList">
              <Stack.Screen name="StaffList"  component={StaffList} options={{ headerShown: false }} />
              <Stack.Screen name="AddOrUpdate" component={AddOrUpdate}/>
            </Stack.Navigator>
        )
};

export default StaffManagementNavigation;