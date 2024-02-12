import React, { useState, createRef, useRef } from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  ScrollView,
  Image,
  Keyboard,
  TouchableOpacity,
  KeyboardAvoidingView,
  Button,
} from 'react-native';

import { FontSize, GlobalColors, GradientButtonColor } from '../../Styles/GlobalStyleConfigs';
import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppDispatch, useAppSelector } from '../../redux/Hooks';
import { GlobalStyles } from '../../Styles/Styles';
import { getBranchesAndStoreId, makeAPIRequest } from '../../utils/Helper';
import { environment } from '../../utils/Constants';
import { setIsLoading } from '../../redux/state/UIStates';
import Toast from 'react-native-root-toast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setCurrentBranch, setStoreIdData, setUserData } from '../../redux/state/UserStates';

const LoginScreen = ({ navigation }: any) => {
  const dispatch = useAppDispatch();

  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const passwordRef = useRef(null);

  const checkUsernamePassword = () => {
    !username ? setError("Username is required") : !password ? setError("Password is required") : setError("");
    setTimeout(() => { setError("") }, 3000);
  }
  const loginAction = async () => {
    if (!username || !password) {
      checkUsernamePassword();
      return;
    }
    let requestBody = { username: username, pwd: password };
    dispatch(setIsLoading({ isLoading: true }));
    let response = await makeAPIRequest(environment.sqlBaseUri + 'slogin', requestBody);
    dispatch(setIsLoading({ isLoading: false }));
    if (response) {
      if (response.active == 0) {
        Toast.show("Sorry, Account is disabled.", { duration: Toast.durations.LONG, backgroundColor: GlobalColors.error });
      } else {
        AsyncStorage.setItem("userData", JSON.stringify(response)); //now while on splash screen will fetch and save to store
        await getBranchesAndStoreId(response.id, dispatch);
        dispatch(setUserData({ userData: response, tenantId: response.tenantId }));
        navigation.navigate("DrawerNavigationRoutes");
      }
    } else {
      Toast.show("Invalid Username or Password!", { duration: Toast.durations.LONG, backgroundColor: GlobalColors.error });
    }
  };

  return (
    <KeyboardAvoidingView style={GlobalStyles.whiteContainer} behavior='padding'>
      <Image
        source={require('../../assets/images/respark_logo.png')}
        style={{ width: '50%', resizeMode: 'contain', marginHorizontal: 10, marginBottom: 5 }}
      />
      <Text style={{ fontSize: FontSize.headingXX, marginBottom: 50 }}>WELCOME</Text>
      <View style={{ width: '70%' }}>
        <Text style={{ fontSize: FontSize.headingX, fontWeight: '200', marginBottom: 30 }}>Login</Text>
        <Text>User Name</Text>
        <View style={[styles.inputContainer, { marginBottom: 20 }]}>
          <Ionicons name="person" size={15} color="lightgray" style={styles.icon} />
          <TextInput
            style={styles.textInput}
            placeholder="User Name"
            placeholderTextColor="lightgray"
            underlineColorAndroid="transparent"
            returnKeyType='next'
            onSubmitEditing={() => {
              passwordRef.current.focus();
            }}
            blurOnSubmit={false}
            onChangeText={(val) => { setUsername(val) }}
          />
        </View>
        <Text>Password</Text>
        <View style={styles.inputContainer}>
          <Ionicons name="md-lock-closed" size={15} color="lightgray" style={styles.icon} />
          <TextInput
            style={styles.textInput}
            placeholder="Password"
            placeholderTextColor="lightgray"
            underlineColorAndroid="transparent"
            secureTextEntry={true}
            onChangeText={(val) => { setPassword(val) }}
            ref={passwordRef}
          />
        </View>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("Forgot Password");
          }}
        >
          <Text style={{ fontSize: FontSize.small, textAlign: 'right' }}>Forgot password ?</Text>
        </TouchableOpacity>
        <Text style={{ fontSize: FontSize.small, color: GlobalColors.error }}>{error}</Text>

        <TouchableOpacity style={{ marginTop: 40, marginHorizontal: 5 }}
          onPress={loginAction}
        >
          <LinearGradient
            colors={GradientButtonColor}
            style={styles.loginButton}
            start={{ y: 0.0, x: 0.0 }}
            end={{ y: 0.0, x: 1.0 }}
          >
            <Text style={styles.loginText}>LOGIN</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};
export default LoginScreen;

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderColor: 'gray',
    paddingVertical: 5,
    marginTop: 5,
    marginBottom: 10
  },
  icon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    fontSize: FontSize.regular,
    color: 'black',
  },
  loginButton: {
    padding: 10,
    borderRadius: 20
  },
  loginText: {
    fontSize: FontSize.large,
    color: "#fff",
    textAlign: 'center',
    fontWeight: 'bold'
  }
});