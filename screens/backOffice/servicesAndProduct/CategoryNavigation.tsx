import { createStackNavigator } from "@react-navigation/stack";
import React, { useEffect } from "react";
import SubCategory from "./SubCategory";
import ItemList from "./ItemList";
import MainCategory from "./MainCategory";
import AddUpdateCategory from "./AddUpdateCategory";
import AddUpdateItem from "./AddUpdateItem";

const Stack = createStackNavigator();

const CategoryNavigation = ({navigation, type}:any) => {

  useEffect(() => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'MainCategory' }],
    });
  }, [type]);

 
  
    return (
        <Stack.Navigator initialRouteName="MainCategory" key={type}>
          <Stack.Screen name="MainCategory"  children={({ navigation }) => <MainCategory type={type} navigation={navigation} />} options={{ headerShown: false }} />
          <Stack.Screen name="AddUpdateCategory" component={AddUpdateCategory}/>
          <Stack.Screen name="SubCategory" component={SubCategory} />
          <Stack.Screen name="ItemList" component={ItemList}/>
          <Stack.Screen name="AddUpdateItem" component={AddUpdateItem} />
        </Stack.Navigator>
    )
};

export default CategoryNavigation;