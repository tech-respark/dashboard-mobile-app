import { View, Text, StyleSheet } from 'react-native';
import React, { FC } from 'react';
import { FontSize, GlobalColors, GradientButtonColor } from '../../Styles/GlobalStyleConfigs';
import { useAppDispatch, useAppSelector } from '../../redux/Hooks';
import { selectCurrentBranch, selectStoreData, selectUserData, setUserData } from '../../redux/state/UserStates';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-root-toast';

type UserProfileBottomSheetProps = {
  handleSheetClose: () => void;
  handleBranchModal: () => void;
  navigation: any;
};

const UserProfileBottomSheet: FC<UserProfileBottomSheetProps> = ({ handleSheetClose, handleBranchModal, navigation }) => {
  const userData = useAppSelector(selectUserData);
  const branchesData = useAppSelector(selectStoreData);
  const currentBranch = useAppSelector(selectCurrentBranch);
  const dispatch = useAppDispatch();

  return (
    <View style={styles.contentContainer}>
      <TouchableOpacity style={{ backgroundColor: GlobalColors.lightGray2, borderRadius: 5, minWidth: '70%', marginBottom: 25, flexDirection: 'row', alignItems: "center", justifyContent: "center", paddingVertical: 5 }}
        onPress={() => {
          if (branchesData!.length > 1) {
            handleSheetClose();
            handleBranchModal();
          } else {
            Toast.show("There is no other branch")
          }
        }}
      >
        <Text style={styles.branchNameText}>{currentBranch}</Text>
        <Ionicons name='chevron-down' size={20} color={GlobalColors.blue} style={{ marginLeft: 15 }} />
      </TouchableOpacity>
      <Text style={styles.nameText}>{userData?.firstName} {userData?.lastName}</Text>
      <Text style={[styles.mobileText, { marginBottom: 10 }]}>{userData?.mobile}</Text>
      <Text style={[styles.mobileText, { marginBottom: 50 }]}>{userData?.email}</Text>
      <Text>Are you sure, you want to logout ?</Text>
      <View style={styles.buttons}>
        <TouchableOpacity onPress={handleSheetClose} style={styles.cancelButtom}>
          <Text style={[styles.cancelButtonText, { color: GlobalColors.blue }]}>Cancel</Text>
        </TouchableOpacity>
        <LinearGradient
          colors={GradientButtonColor}
          style={styles.cancelButtom}
          start={{ y: 0.0, x: 0.0 }}
          end={{ y: 0.0, x: 1.0 }}
        >
          <TouchableOpacity onPress={() => {
            AsyncStorage.multiRemove(["userData", "selectedBranchName"])
            dispatch(setUserData({}));
            navigation.replace("Login");
          }
          } >
            <Text style={[styles.cancelButtonText, { color: '#fff' }]}>Logout</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </View>
  )
};
const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    padding: 10
  },
  cancelButtom: {
    borderWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 30,
    borderRadius: 20,
    borderColor: GlobalColors.blue
  },
  cancelButtonText:
  {
    fontSize: FontSize.large,
    paddingHorizontal: 20
  },
  branchNameText: {
    fontSize: FontSize.headingX,
    textTransform: 'capitalize',
    textAlign: "center"
  },
  nameText: {
    fontSize: FontSize.large,
    marginBottom: 10
  },
  mobileText: {
    fontWeight: '300',
    fontSize: FontSize.medium
  },
  buttons: {
    flexDirection: 'row',
    marginTop: 20,
    justifyContent: 'space-evenly', width: '100%'
  }
});


export default UserProfileBottomSheet;
