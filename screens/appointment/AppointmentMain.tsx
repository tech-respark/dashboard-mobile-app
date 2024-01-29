import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import AppointmentCalendar from "./calendar/Calendar";
import CreateAppointment from "./createAppointment/CreateAppointment";

const Stack = createStackNavigator();

const AppointmentMain = () => {
        return (
            <Stack.Navigator initialRouteName="Calender">
              <Stack.Screen name="Calendar"  component={AppointmentCalendar} options={{ headerShown: false }} />
              <Stack.Screen name="Create Appointment"  component={CreateAppointment} />
            </Stack.Navigator>
        )
};

export default AppointmentMain;