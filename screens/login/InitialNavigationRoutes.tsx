import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SplashScreen from './Splash';
import LoginScreen from './Login';
import ForgotPassword from './ForgotPassword';
import { useAppSelector } from '../../redux/Hooks';
import { selectIsLoading } from '../../redux/state/UIStates';
import { ActivityIndicator, View } from 'react-native';
import { GlobalStyles } from '../../Styles/Styles';
import DrawerNavigationRoutes from '../drawerAndNavigationBar/DrawerNavigationRoutes';

const Stack = createStackNavigator();

const InitialNavigationRoutes = () => {
  const isLoading = useAppSelector(selectIsLoading);
  return (
    <>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Splash">
          <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Forgot Password" component={ForgotPassword} />
          <Stack.Screen name="DrawerNavigationRoutes" component={DrawerNavigationRoutes} options={{headerShown: false}}/>
        </Stack.Navigator>
      </NavigationContainer>
      {isLoading &&
        <View style={GlobalStyles.isLoading}>
          <ActivityIndicator />
        </View>
      }
    </>
  );
};

export default InitialNavigationRoutes;