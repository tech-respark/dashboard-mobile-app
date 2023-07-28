import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {createDrawerNavigator} from '@react-navigation/drawer';
import { GlobalStyles } from '../Styles/Styles';
import { Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import Screens
// import HomeScreen from './DrawerScreens/HomeScreen';
// import SettingsScreen from './DrawerScreens/SettingsScreen';
// import CustomSidebarMenu from './Components/CustomSidebarMenu';
// import NavigationDrawerHeader from './Components/NavigationDrawerHeader';

// const Stack = createStackNavigator();
// const Drawer = createDrawerNavigator();

// const homeScreenStack = ({navigation}) => {
//   return (
//     <Stack.Navigator initialRouteName="HomeScreen">
//       <Stack.Screen
//         name="HomeScreen"
//         component={HomeScreen}
//         options={{
//           title: 'Home', //Set Header Title
//           headerLeft: () => (
//             <NavigationDrawerHeader navigationProps={navigation} />
//           ),
//           headerStyle: {
//             backgroundColor: '#307ecc', //Set Header color
//           },
//           headerTintColor: '#fff', //Set Header text color
//           headerTitleStyle: {
//             fontWeight: 'bold', //Set Header text style
//           },
//         }}
//       />
//     </Stack.Navigator>
//   );
// };

// const settingScreenStack = ({navigation}) => {
//   return (
//     <Stack.Navigator
//       initialRouteName="SettingsScreen"
//       screenOptions={{
//         headerLeft: () => (
//           <NavigationDrawerHeader navigationProps={navigation} />
//         ),
//         headerStyle: {
//           backgroundColor: '#307ecc', //Set Header color
//         },
//         headerTintColor: '#fff', //Set Header text color
//         headerTitleStyle: {
//           fontWeight: 'bold', //Set Header text style
//         },
//       }}>
//       <Stack.Screen
//         name="SettingsScreen"
//         component={SettingsScreen}
//         options={{
//           title: 'Settings', //Set Header Title
//         }}
//       />
//     </Stack.Navigator>
//   );
// };

const DrawerNavigatorRoutes = ({navigation}: any) => {
  return (
    <View style={GlobalStyles.whiteContainer}>
        <Text onPress={async() => {
          await AsyncStorage.removeItem("userData");
          navigation.replace("Login");
        }}>HOME</Text>
    </View>
    // <Drawer.Navigator
    //   drawerContentOptions={{
    //     activeTintColor: '#cee1f2',
    //     color: '#cee1f2',
    //     itemStyle: {marginVertical: 5, color: 'white'},
    //     labelStyle: {
    //       color: '#d8d8d8',
    //     },
    //   }}
    //   screenOptions={{headerShown: false}}
    //   drawerContent={CustomSidebarMenu}>
    //   <Drawer.Screen
    //     name="homeScreenStack"
    //     options={{drawerLabel: 'Home Screen'}}
    //     component={homeScreenStack}
    //   />
    //   <Drawer.Screen
    //     name="settingScreenStack"
    //     options={{drawerLabel: 'Setting Screen'}}
    //     component={settingScreenStack}
    //   />
    // </Drawer.Navigator>
  );
};

export default DrawerNavigatorRoutes;