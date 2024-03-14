import React, { useState, useEffect } from 'react';
import { ActivityIndicator, View, StyleSheet, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppDispatch } from '../../redux/Hooks';
import { setUserData } from '../../redux/state/UserStates';
import { getBranchesAndStoreId } from '../../utils/Helper';
import { GlobalColors } from '../../Styles/GlobalStyleConfigs';

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
        data ? await getBranchesAndStoreId(data.tenantId, dispatch) : null;
        navigation.replace("DrawerNavigationRoutes");
      } else {
        navigation.replace("Login");
      }
    }, 1000);
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/images/splash_graphic.png')}
        style={{ width: '90%', resizeMode: 'contain', marginHorizontal: 10, marginBottom: 5 }}
      />
      <Image
        source={require('../../assets/images/respark_logo.png')}
        style={styles.overlayImage}
      />
      <ActivityIndicator
        animating={animating}
        color={GlobalColors.blueLight}
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
    backgroundColor: '#fff',
  },
  activityIndicator: {
    alignItems: 'center',
    height: 80,
  },
  overlayImage: {
    position: 'absolute',
    alignSelf: 'center',
    resizeMode: 'contain',
    width: '38%',
    top: '38%',
    left: '33%'
  },
});

export default SplashScreen;
