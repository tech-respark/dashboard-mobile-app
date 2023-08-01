import React, { useState, useEffect } from 'react';
import { ActivityIndicator, View, StyleSheet, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppDispatch } from '../../redux/Hooks';
import { setUserData } from '../../redux/state/UserStates';
import { getBranchesAndStoreId } from '../../utils/Helper';

const SplashScreen = ({ navigation }: any) => {
  const dispatch = useAppDispatch();
  const [animating, setAnimating] = useState(true);

  useEffect(() => {
    setTimeout(async () => {
      setAnimating(false);
      //here we load user login information and if it already there, we call branches information and save it in store else go to login
      let userData = await AsyncStorage.getItem('userData');
      if (userData != null) {
        let data: {[key: string]: any} = JSON.parse(userData) ?? {};
        dispatch(setUserData({ userData: data, tenantId: data.tenantId}));
        data ? await getBranchesAndStoreId(data.id, dispatch) : null;
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
