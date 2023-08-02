import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import Services from "./Services";
import AddNew from "./AddNew";
import SubCategory from "./SubCategory";
import ItemList from "./ItemList";

const Stack = createStackNavigator();

const ServicesNavigation = () => {
    return (
        <Stack.Navigator initialRouteName="Services">
          <Stack.Screen name="Services" component={Services} options={{ headerShown: false }} />
          <Stack.Screen name="AddNew" component={AddNew} />
          <Stack.Screen name="SubCategory" component={SubCategory} />
          <Stack.Screen name="ItemList" component={ItemList} />

        </Stack.Navigator>
    )
};

export default ServicesNavigation;