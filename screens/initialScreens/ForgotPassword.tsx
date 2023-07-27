import React, { useState } from "react";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import { GlobalStyles } from "../../Styles/Styles";
import Ionicons from '@expo/vector-icons/Ionicons';
import Feather from '@expo/vector-icons/Feather';
import { FontSize, GlobalColors, GradientButtonColor } from "../../Styles/GlobalStyleConfigs";
import { Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import OTPInput from "../../components/OtpTextField";
import { sleep } from "../../utils/Helper";
import { useAppDispatch, useAppSelector } from "../../redux/Hooks";
import { selectIsLoading, setIsLoading } from "../../redux/state/Loaders";
import PasswordInput from "../../components/PasswordTextField";


const ForgotPassword = ({ navigation }: any) => {
    const dispatch = useAppDispatch();
    const [currentState, setCurrentState] = useState<'USERNAME' | 'OTP' | 'UPDATE'>('USERNAME');
    const [userName, setUserName] = useState<string>("");
    const [otpString, setOtpString] = useState<string>("");
    const [newPassword, setNewPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");

    const onOtpChange = (otp: string) => {
        setOtpString(otp);
    };

    const onNewPasswordChange = (password: string) => {
        setNewPassword(password);
    };

    const onConfirmPasswordChange = (password: string) => {
        setConfirmPassword(password);
    };

    const checkUserName = async () => {
        dispatch(setIsLoading({ isLoading: true }));
        await sleep(500);
        setCurrentState("OTP");
        dispatch(setIsLoading({ isLoading: false }));
    };

    const checkOtp = async () => {
        dispatch(setIsLoading({ isLoading: true }));
        await sleep(500);
        setCurrentState("UPDATE");
        dispatch(setIsLoading({ isLoading: false }));
    };

    const updatePassword = async () => {
        dispatch(setIsLoading({ isLoading: true }));
        await sleep(500);
        dispatch(setIsLoading({ isLoading: false }));
        navigation.navigate("Login");
    };

    return (
        <View style={GlobalStyles.whiteContainer}>
            {
                currentState == "USERNAME" ?
                    <View style={{ width: "60%" }}>
                        <Ionicons name="lock-open-outline" size={30} color={GlobalColors.blueLight} style={styles.icon} />
                        <Text style={{ marginBottom: 10, fontWeight: 'bold', fontSize: FontSize.heading }}>Forgot Password ?</Text>
                        <Text style={{ marginBottom: 25 }}>Please enter your username</Text>
                        <TextInput
                            style={styles.inputContainer}
                            placeholder="Enter User name"
                            placeholderTextColor="gray"
                            underlineColorAndroid="transparent"
                            onChangeText={(val) => { setUserName(val) }}
                        />
                    </View> :
                    currentState == "OTP" ?
                        <View style={{ width: "60%" }}>
                            <Feather name="check-circle" size={30} color={GlobalColors.blueLight} style={styles.icon} />
                            <Text style={{ marginBottom: 10, fontWeight: 'bold', fontSize: FontSize.heading }}>Verification</Text>
                            <Text style={{ marginBottom: 35 }}>Enter the OTP we sent you</Text>
                            <OTPInput numberOfDigits={4} onOtpChange={onOtpChange} />
                            <View style={{ alignItems: 'center', marginTop: 50 }}>
                                <Text style={{ marginBottom: 10, fontSize: FontSize.small, color: 'gray' }}>Didn't receive OTP ?</Text>
                                <Text style={{ color: GlobalColors.blue }} onPress={() => { }}>Resend</Text>
                            </View>
                        </View> :
                        <View style={{ width: "60%" }}>
                            <Ionicons name="key-outline" size={30} color={GlobalColors.blueLight} style={styles.icon} />
                            <Text style={{ marginBottom: 10, fontWeight: 'bold', fontSize: FontSize.heading }}>New Credentials</Text>
                            <Text>Your identity has been verified! </Text>
                            <Text style={{ marginBottom: 30 }}>Set your new password</Text>
                            <PasswordInput placeholder="New Password" onChangeText={onNewPasswordChange} />
                            <PasswordInput placeholder="Confirm Password" onChangeText={onConfirmPasswordChange} />
                        </View>

            }

            <TouchableOpacity style={{ width: "70%" }}
                onPress={async () => {
                    currentState == "USERNAME" ? await checkUserName() : currentState == "OTP" ? await checkOtp() : await updatePassword();
                }}
            >
                <LinearGradient
                    colors={GradientButtonColor}
                    style={[styles.button, currentState == "OTP" ? { marginTop: 30 } : { marginTop: 80 }]}
                    start={{ y: 0.0, x: 0.0 }}
                    end={{ y: 0.0, x: 1.0 }}
                >
                    <Text style={styles.buttonText}>{currentState == "UPDATE" ? "Update" : "Next"}</Text>
                </LinearGradient>
            </TouchableOpacity>
        </View>
    )
};

const styles = StyleSheet.create({
    buttonText: {
        color: "#fff",
        fontSize: FontSize.regular,
        fontWeight: 'bold',
        textAlign: 'center',
        paddingVertical: 2
    },
    icon: {
        marginVertical: 10
    },
    button: {
        padding: 10,
        borderRadius: 20,
    },
    inputContainer: {
        alignItems: 'center',
        borderWidth: 0.4,
        borderColor: 'lightgray',
        paddingVertical: 10,
        paddingHorizontal: 10,
        marginVertical: 10,
        borderRadius: 5,
        elevation: 2, //for android only
        shadowColor: "black",
        shadowOffset: { width: 0, height: 0.2 },
        shadowOpacity: 0.1,
        shadowRadius: 1
    },

});

export default ForgotPassword;