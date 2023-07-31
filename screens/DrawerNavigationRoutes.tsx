import React, { useEffect, useLayoutEffect, useState } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import POSMainScreen from './pos/PosMain';
import BackOfficeMainScreen from './backOffice/BackOfficeMain';
import { FontSize, GlobalColors } from '../Styles/GlobalStyleConfigs';
import { useAppDispatch, useAppSelector } from '../redux/Hooks';
import { setIsLoading } from '../redux/state/UIStates';
import { getCurrentBranchId, makeAPIRequest } from '../utils/Helper';
import { environment } from '../utils/Constants';
import { selectTenantId, setConfig } from '../redux/state/UserStates';

const Drawer = createDrawerNavigator();

const DrawerNavigationRoutes = ({ navigation }: any) => {
  const dispatch = useAppDispatch();

  const storeId = getCurrentBranchId();
  const tenantId = useAppSelector(selectTenantId);

  const [mainMenuOptions, setMainMenuOptions] = useState<string[]>([]);
  const [showDrawer, setShowDrawer] = useState<boolean>(false);
  const [showUserProfile, setShowUserProfile] = useState<boolean>(false);

  const getUserConfig = async() => {
    dispatch(setIsLoading({ isLoading: true }));
    let url = environment.documentBaseUri+`stores`;
    url += tenantId ? `/getStoreByTenantAndStoreId?storeId=${storeId}&tenantId=${tenantId}` : `/${storeId}`
    let response = await makeAPIRequest(url, null, "GET");
    console.log("HELLO", response);
    if(response){
      dispatch(setConfig({configs: response}));
    }
    dispatch(setIsLoading({ isLoading: false }));
  };

  useEffect(() => {
    getUserConfig();
  }, [])

  return (
    <Drawer.Navigator
      screenOptions={{
        headerTitleAlign: "left",
        headerTitle: () => (
          <Text style={{fontSize: FontSize.large}}>Back Office</Text>
        ),
        headerRight: () => (
          <TouchableOpacity onPress={() => setShowUserProfile(true)}>
            <Ionicons name="person-outline" size={25} style={{marginRight: 10}} color={GlobalColors.blue}/>
          </TouchableOpacity>
        ),
      }}
      initialRouteName='BackOffice'
    >
      <Drawer.Screen name="POS" options={{ drawerLabel: 'POS' }} component={POSMainScreen} />
      <Drawer.Screen
        name="BackOffice"
        options={{ drawerLabel: 'Back Office' }}
        component={BackOfficeMainScreen}
      />
    </Drawer.Navigator>
  );
};

export default DrawerNavigationRoutes;