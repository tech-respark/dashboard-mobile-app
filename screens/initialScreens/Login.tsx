import React, { useState, createRef } from 'react';
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

import { FontSize, GradientButtonColor } from '../../Styles/GlobalStyleConfigs';
import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppDispatch, useAppSelector } from '../../redux/Hooks';
// import { addMessage, selectMessage } from '../../redux/state/Loaders';
import { GlobalStyles } from '../../Styles/Styles';

const LoginScreen = ({ navigation }: any) => {

  const dispatch = useAppDispatch();
  // const message = useAppSelector(selectMessage);

  return (
    <View style={GlobalStyles.whiteContainer}>
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
          />
        </View>
        <TouchableOpacity
        onPress={()=>{
          navigation.navigate("Forgot Password");
        }}
        >
          <Text style={{ fontSize: FontSize.small, textAlign: 'right' }}>Forgot password ?</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ marginTop: 50, marginHorizontal: 5 }}
          onPress={() => {
            // const uuid = 'hendowie20e20';
            // dispatch(addMessage({ uuid: uuid, text: "Hello hey" }));
          }}
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
    </View>
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