import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import AppointmentCalendar from "./calendar/Calendar";
import CreateEditAppointment from "./createAppointment/CreateEditAppointment";
import UserHistory from "./userHistory/UserHistory";

const Stack = createStackNavigator();

const AppointmentMain = () => {
  return (
    <Stack.Navigator initialRouteName="Calender">
      <Stack.Screen name="Calendar" component={AppointmentCalendar} options={{ headerShown: false }} />
      <Stack.Screen name="Create Edit Appointment" component={CreateEditAppointment} />
      <Stack.Screen name="User History" component={UserHistory} />
    </Stack.Navigator>
  )
};

export default AppointmentMain;