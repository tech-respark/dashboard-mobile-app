import React, { useRef, useState } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import POSMainScreen from '../pos/PosMain';
import BackOfficeMainScreen from '../backOffice/BackOfficeMain';
import { FontSize, GlobalColors } from '../../Styles/GlobalStyleConfigs';
import { useAppSelector } from '../../redux/Hooks';
import { selectShowUserProfileTopBar } from '../../redux/state/UIStates';
import { mainTabsIconsMap } from '../../utils/Constants';
import CustomDrawerContent from './SideDrawer';
import UserProfileBottomSheet from './UserProfileBottomSheet';
import BottomSheet from '@gorhom/bottom-sheet';
import AppointmentMain from '../appointment/AppointmentMain';
import CrmMain from '../crm/CrmMain';
import BranchSelectModal from './BranchSelectModal';
import useInitialDataFetch from '../../customHooks/InitialDataFetch';

const Drawer = createDrawerNavigator();

const DrawerNavigationRoutes = ({ navigation }: any) => {
  const showHeader = useAppSelector(selectShowUserProfileTopBar);
  const initialFetchData = useInitialDataFetch();

  const [isSheetOpen, setIsSheetOpen] = useState<boolean>(false);
  const [showBranchModal, setShowBranchModal] = useState<boolean>(false);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = ['1%', '45%'];

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
            onPress={() => { navigation.openDrawer() }}
            style={{ backgroundColor: GlobalColors.grayDark, padding: 8, marginLeft: 10, borderRadius: 20 }}>
            <FontAwesome
              name={mainTabsIconsMap[name] as 'key'}
              size={20}
              color="#fff"
            />
          </TouchableOpacity>
        ),
        drawerLabel: name,
        headerShown: showHeader,
      }
    )

  };

  return (
    <View style={{ flex: 1 }}>
      <View style={[styles.mainContent, { opacity: isSheetOpen ? 0.5 : 1, pointerEvents: isSheetOpen ? 'none' : 'auto' }]}>
        <Drawer.Navigator
          screenOptions={({ route }) => ({
            unmountOnBlur: true,
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
          <Drawer.Screen name="POS" options={({ navigation }) => setLeftHeader(navigation, 'POS')} component={POSMainScreen} />
          <Drawer.Screen name="Appointment" options={({ navigation }) => setLeftHeader(navigation, 'Appointment')} component={AppointmentMain} />
          <Drawer.Screen name="Backoffice" options={({ navigation }) => setLeftHeader(navigation, 'Backoffice')} component={BackOfficeMainScreen} />
          <Drawer.Screen name="CRM" options={({ navigation }) => setLeftHeader(navigation, 'CRM')} component={CrmMain} />
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
    backgroundColor: '#fff',
    elevation: 5,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  handleIndicator: {
    backgroundColor: 'transparent',
  },

});

export default DrawerNavigationRoutes;