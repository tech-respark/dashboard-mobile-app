import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { Text } from "react-native";
import AppointmentCalendar from "./calendar/Calendar";

const Stack = createStackNavigator();

const AppointmentMain = () => {
        return (
            <Stack.Navigator initialRouteName="Calender">
              <Stack.Screen name="Calendar"  component={AppointmentCalendar} options={{ headerShown: false }} />
            </Stack.Navigator>
        )
    
};

export default AppointmentMain;