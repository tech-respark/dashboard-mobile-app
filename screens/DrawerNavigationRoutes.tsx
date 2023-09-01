import React, { useEffect, useRef, useState } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import POSMainScreen from './pos/PosMain';
import BackOfficeMainScreen from './backOffice/BackOfficeMain';
import { FontSize, GlobalColors } from '../Styles/GlobalStyleConfigs';
import { useAppDispatch, useAppSelector } from '../redux/Hooks';
import { setIsLoading } from '../redux/state/UIStates';
import { makeAPIRequest } from '../utils/Helper';
import { environment } from '../utils/Constants';
import { selectBranchId, selectTenantId, setConfig } from '../redux/state/UserStates';
import CustomDrawerContent from '../components/SideDrawer';
import UserProfileBottomSheet from '../components/UserProfileBottomSheet';
import BottomSheet from '@gorhom/bottom-sheet';
import AppointmentMain from './appointment/AppointmentMain';
import CrmMain from './crm/CrmMain';
import { useRoute } from '@react-navigation/native';

const Drawer = createDrawerNavigator();

const DrawerNavigationRoutes = ({ navigation }: any) => {
  const dispatch = useAppDispatch();
  const route = useRoute()
  const storeId = useAppSelector(selectBranchId);
  const tenantId = useAppSelector(selectTenantId);

  const [isSheetOpen, setIsSheetOpen] = useState<boolean>(false);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = ['1%', '40%'];

  const getUserConfig = async () => {
    dispatch(setIsLoading({ isLoading: true }));
    let url = environment.documentBaseUri + `stores`;
    url += tenantId ? `/getStoreByTenantAndStoreId?storeId=${storeId}&tenantId=${tenantId}` : `/${storeId}`
    let response = await makeAPIRequest(url, null, "GET");
    if (response) {
      dispatch(setConfig({ configs: response }));
    }
    dispatch(setIsLoading({ isLoading: false }));
  };
  const handleSheetChanges = (index: number) => {
    if (index === 0) {
      setIsSheetOpen(false);
    }
  };
  const handleSheetClose = () => {
    if (bottomSheetRef.current) {
      bottomSheetRef.current.close();
      setIsSheetOpen(false);
    }
  };

  useEffect(() => {
    getUserConfig();
  }, [])

  return (
    <View style={{ flex: 1 }}>
      <View style={[styles.mainContent, { opacity: isSheetOpen ? 0.5 : 1, pointerEvents: isSheetOpen ? 'none' : 'auto' }]}>
        <Drawer.Navigator
          screenOptions={({ route }) => ({
            headerTitleAlign: 'left',
            headerTitle: () => (
              <Text style={{ fontSize: FontSize.large }}>{route.name}</Text>
            ),
            headerRight: () => (
              <TouchableOpacity
                onPress={() => {
                  if (bottomSheetRef.current) {
                    bottomSheetRef.current.snapToIndex(1);
                    setIsSheetOpen(true);
                  }
                }}
              >
                <Ionicons
                  name="person-outline"
                  size={25}
                  style={{ marginRight: 10 }}
                  color={GlobalColors.blue}
                />
              </TouchableOpacity>
            ),
          })}
          drawerContent={(props) => <CustomDrawerContent {...props} />}
          initialRouteName="Appointment"
        >
          <Drawer.Screen name="POS" options={{ drawerLabel: 'POS' }} component={POSMainScreen} />
          <Drawer.Screen name="Appointment" options={{ drawerLabel: 'Appointment' }} component={AppointmentMain} />
          <Drawer.Screen name="Backoffice" options={{ drawerLabel: 'Backoffice' }} component={BackOfficeMainScreen} />
          <Drawer.Screen name="CRM" options={{ drawerLabel: 'CRM' }} component={CrmMain} />

        </Drawer.Navigator>
      </View>
      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        style={styles.bottomSheet}
        handleIndicatorStyle={styles.handleIndicator}
        onChange={handleSheetChanges}
      >
        <UserProfileBottomSheet handleSheetClose={handleSheetClose} navigation={navigation} />
      </BottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContent: {
    flex: 1,
    backgroundColor: 'white',
  },
  bottomSheet: {
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    backgroundColor: 'transparent',
    ...Platform.select({
      android: {
        elevation: 5,
      },
      ios: {
        shadowColor: 'black',
        shadowOffset: { width: 0, height: -5 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
      },
    }),

  },
  handleIndicator: {
    backgroundColor: 'transparent',
  },
});

export default DrawerNavigationRoutes;