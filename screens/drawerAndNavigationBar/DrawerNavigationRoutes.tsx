import React, { useEffect, useRef, useState } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Modal, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import POSMainScreen from '../pos/PosMain';
import BackOfficeMainScreen from '../backOffice/BackOfficeMain';
import { FontSize, GlobalColors } from '../../Styles/GlobalStyleConfigs';
import { useAppDispatch, useAppSelector } from '../../redux/Hooks';
import { selectShowUserProfileTopBar, setIsLoading } from '../../redux/state/UIStates';
import { makeAPIRequest } from '../../utils/Helper';
import { environment, mainTabsIconsMap } from '../../utils/Constants';
import { selectBranchId, selectTenantId, setConfig, setCurrrentStoreConfig, setStaffData } from '../../redux/state/UserStates';
import CustomDrawerContent from './SideDrawer';
import UserProfileBottomSheet from './UserProfileBottomSheet';
import BottomSheet from '@gorhom/bottom-sheet';
import AppointmentMain from '../appointment/AppointmentMain';
import CrmMain from '../crm/CrmMain';
import BranchSelectModal from './BranchSelectModal';

const Drawer = createDrawerNavigator();

const DrawerNavigationRoutes = ({ navigation }: any) => {
  const dispatch = useAppDispatch();
  const storeId = useAppSelector(selectBranchId);
  const tenantId = useAppSelector(selectTenantId);
  const showHeader = useAppSelector(selectShowUserProfileTopBar);

  const [isSheetOpen, setIsSheetOpen] = useState<boolean>(false);
  const [showBranchModal, setShowBranchModal] = useState<boolean>(false);
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

  const getStaffDetails = async () => {
    dispatch(setIsLoading({ isLoading: true }));
    let url = environment.sqlBaseUri + `staffs/${tenantId}/${storeId}`;
    let responseStaff = await makeAPIRequest(url, null, "GET");
    dispatch(setIsLoading({ isLoading: false }));
    if (responseStaff) {
      dispatch(setStaffData({ staffData: responseStaff }));
    }
  };

  const getStoreConfig = async () => {
    dispatch(setIsLoading({ isLoading: true }));
    let url = environment.documentBaseUri + `configs/tenant/${tenantId}/store/${storeId}`;
    let response = await makeAPIRequest(url, null, "GET");
    dispatch(setIsLoading({ isLoading: false }));
    if (response) {
      dispatch(setCurrrentStoreConfig({ currentStoreConfig: response }));
    }
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

  const setLeftHeader = (navigation: any, name: string) => {
    return (
      {
        headerLeft: () => (
          <TouchableOpacity
            onPress={() => {navigation.openDrawer()}}
            style={{backgroundColor: GlobalColors.grayDark, padding: 8, marginLeft: 10, borderRadius: 20}}>
            <FontAwesome
              name={mainTabsIconsMap[name] as 'key'}
              size={20}
              color="#fff"
            />
          </TouchableOpacity>
        ),
        drawerLabel: name,
        headerShown: showHeader
      }
    )
   
  }

  useEffect(() => {
    getUserConfig();
    getStaffDetails();
    getStoreConfig();
  }, [])

  return (
    <View style={{ flex: 1 }}>
      <View style={[styles.mainContent, { opacity: isSheetOpen ? 0.5 : 1, pointerEvents: isSheetOpen ? 'none' : 'auto' }]}>
        <Drawer.Navigator
          screenOptions={({ route }) => ({
            drawerType: "front",
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
          initialRouteName="Backoffice"
        >
          <Drawer.Screen name="POS" options={({navigation}) => setLeftHeader(navigation, 'POS')} component={POSMainScreen}/>
          <Drawer.Screen name="Appointment" options={({navigation}) => setLeftHeader(navigation, 'Appointment')} component={AppointmentMain}/>
          <Drawer.Screen name="Backoffice" options={({navigation}) => setLeftHeader(navigation, 'Backoffice')} component={BackOfficeMainScreen} />
          <Drawer.Screen name="CRM" options={({navigation}) => setLeftHeader(navigation, 'CRM')} component={CrmMain} />
        </Drawer.Navigator>
      </View>
      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        style={styles.bottomSheet}
        handleIndicatorStyle={styles.handleIndicator}
        onChange={handleSheetChanges}
      >
        <UserProfileBottomSheet handleSheetClose={handleSheetClose} handleBranchModal={() => setShowBranchModal(true)} navigation={navigation} />
      </BottomSheet>
      <BranchSelectModal showBranchModal={showBranchModal} setShowBranchModal={(val) => setShowBranchModal(val)} />
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