import React, { useEffect, useState } from "react";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import { GlobalStyles } from "../../Styles/Styles";
import Ionicons from '@expo/vector-icons/Ionicons';
import Feather from '@expo/vector-icons/Feather';
import { FontSize, GlobalColors, GradientButtonColor } from "../../Styles/GlobalStyleConfigs";
import { Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import OTPInput from "../../components/OtpTextField";
import { makeAPIRequest, sleep } from "../../utils/Helper";
import { useAppDispatch, useAppSelector } from "../../redux/Hooks";
import { selectIsLoading, setIsLoading } from "../../redux/state/UIStates";
import PasswordInput from "../../components/PasswordTextField";
import { environment } from "../../utils/Constants";
import Toast from "react-native-root-toast";


const ForgotPassword = ({ navigation }: any) => {
    const dispatch = useAppDispatch();
    const [currentState, setCurrentState] = useState<'USERNAME' | 'OTP' | 'UPDATE'>('USERNAME');
    const [userName, setUserName] = useState<string>("");
    const [otpString, setOtpString] = useState<string>("");
    const [newPassword, setNewPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [timer, setTimer] = useState<number>(0);

    const onOtpChange = (otp: string) => {
        setOtpString(otp);
    };

    const onNewPasswordChange = (password: string) => {
        setNewPassword(password);
    };

    const onConfirmPasswordChange = (password: string) => {
        setConfirmPassword(password);
    };

    const setErrorMsg = (msg: string) => {
        setError(msg);
        setTimeout(() => {
            setError("");
        }, 3000);
    };

    const checkUserName = async () => {
        if (!userName) {
            setErrorMsg("Username is required!");
            return;
        }
        dispatch(setIsLoading({ isLoading: true }));
        const headers: RequestInit = { headers: { 'Content-Type': "application/json", "user": userName } };
        let response = await makeAPIRequest(environment.sqlBaseUri + 'staffs/resetotp', null, "POST", headers);
        response ? setCurrentState("OTP") : Toast.show("This username does not exist!", { duration: Toast.durations.SHORT, backgroundColor: GlobalColors.error });
        dispatch(setIsLoading({ isLoading: false }));
    };

    const checkOtp = async () => {
        if (otpString.length != 6) {
            setErrorMsg("OTP is required!");
            return;
        }
        dispatch(setIsLoading({ isLoading: true }));
        const headers: RequestInit = { headers: { 'Content-Type': "application/json", "user": userName, "otp": otpString } };
        let response = await makeAPIRequest(environment.sqlBaseUri + 'staffs/verifyotp', null, "POST", headers);
        response ? setCurrentState("UPDATE") : Toast.show("Incorrect OTP", { duration: Toast.durations.SHORT, backgroundColor: GlobalColors.error });
        dispatch(setIsLoading({ isLoading: false }));
    };

    const resendOTP = async () => {
        setTimer(60);
        dispatch(setIsLoading({ isLoading: true }));
        const headers: RequestInit = { headers: { 'Content-Type': "application/json", "user": userName } };
        let response = await makeAPIRequest(environment.sqlBaseUri + 'staffs/resetotp', null, "POST", headers);
        dispatch(setIsLoading({ isLoading: false }));
        response ? Toast.show("OTP sent", { duration: Toast.durations.SHORT, backgroundColor: GlobalColors.success }) :
            Toast.show("Failed to send OTP", { duration: Toast.durations.SHORT, backgroundColor: GlobalColors.error });
    };

    const updatePassword = async () => {
        if (!newPassword || !confirmPassword) {
            !newPassword ? setErrorMsg("Password is required!") : !confirmPassword ? setErrorMsg("Confirm the password!") : setError("");
        } else if (newPassword != confirmPassword) {
            setErrorMsg("Password does not match!");
        } else {
            dispatch(setIsLoading({ isLoading: true }));
            await sleep(500);
            const headers: RequestInit = { headers: { 'Content-Type': "application/json", "user": userName, "pwd": newPassword } };
            let response = await makeAPIRequest(environment.sqlBaseUri + 'staffs/updatepwd', null, "POST", false, headers);
            dispatch(setIsLoading({ isLoading: false }));
            if (response) {
                navigation.replace("Login");
                setCurrentState("UPDATE")
            } else {
                Toast.show("Not able to update password", { duration: Toast.durations.SHORT, backgroundColor: GlobalColors.error });
            }
        }

    };

    useEffect(() => {
        let interval: any;
        if (timer > 0 && timer <= 60) {
          interval = setInterval(() => {
            setTimer(prevTimer => prevTimer - 1);
          }, 1000);
        }
        return () => clearInterval(interval);
      }, [timer]);

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
                        <View style={{ width: "70%" }}>
                            <Feather name="check-circle" size={30} color={GlobalColors.blueLight} style={styles.icon} />
                            <Text style={{ marginBottom: 10, fontWeight: 'bold', fontSize: FontSize.heading }}>Verification</Text>
                            <Text style={{ marginBottom: 35 }}>Enter the OTP we sent you</Text>
                            <OTPInput numberOfDigits={6} onOtpChange={onOtpChange} />
                            <View style={{ alignItems: 'center', marginTop: 50, marginBottom: 10 }}>
                                {timer == 0 ? <>
                                    <Text style={{ marginBottom: 10, fontSize: FontSize.small, color: 'gray' }}>Didn't receive OTP ?</Text>
                                <Text style={{ color: GlobalColors.blue }} onPress={() => {resendOTP()}}>Resend</Text>
                                </> : 
                                <Text style={{color: 'gray', fontSize: FontSize.regular}}>{`Resend in 00:${timer}`}</Text>}
                                
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

            <Text style={{ fontSize: FontSize.small, color: GlobalColors.error }}>{error}</Text>
            <TouchableOpacity style={[{ width: "70%" }, currentState == "OTP" ? { marginTop: 30 } : { marginTop: 80 }]}
                onPress={async () => {
                    currentState == "USERNAME" ? await checkUserName() : currentState == "OTP" ? await checkOtp() : await updatePassword();
                }}
            >
                <LinearGradient
                    colors={GradientButtonColor}
                    style={styles.button}
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