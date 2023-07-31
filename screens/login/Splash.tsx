import React, { useState, useEffect } from 'react';
import { ActivityIndicator, View, StyleSheet, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppDispatch } from '../../redux/Hooks';
import { setUserData } from '../../redux/state/UserStates';

const SplashScreen = ({ navigation }: any) => {
  const dispatch = useAppDispatch();
  const [animating, setAnimating] = useState(true);

  useEffect(() => {
    setTimeout(async () => {
      setAnimating(false);
      let userData = await AsyncStorage.getItem('userData');
      if (userData != null) {
        console.log("FIrst", userData);
        let data: {[key: string]: any} = JSON.parse(userData) ?? {};
        dispatch(setUserData({ userData: data, tenantId: data.tenantId}));
        navigation.replace("DrawerNavigationRoutes");
      } else {
        navigation.replace("Login");
      }
    }, 1000);
  }, []);

  return (
    <View style={styles.container}>
      <ActivityIndicator
        animating={animating}
        color="#FFFFFF"
        size="large"
        style={styles.activityIndicator}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#307ecc',
  },
  activityIndicator: {
    alignItems: 'center',
    height: 80,
  },
});

export default SplashScreen;
