import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { FC } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { FontSize, GlobalColors, GradientButtonColor } from "../Styles/GlobalStyleConfigs";

type SubmitCancelButtonsProps = {
    cancelHandler: () => void;
    cancelText: string;
    submitHandler: () => Promise<void>;
    submitText: string;
}
const SubmitCancelButtons: FC<SubmitCancelButtonsProps> = ({ cancelHandler, cancelText, submitHandler, submitText }) => {
    return (
        <View style={styles.buttons}>
            <TouchableOpacity onPress={cancelHandler} style={[styles.cancelButtom, { alignItems: 'center' }]}>
                <Text style={[styles.cancelButtonText, { color: GlobalColors.blue }]}>{cancelText}</Text>
            </TouchableOpacity>
            <LinearGradient
                colors={GradientButtonColor}
                style={styles.cancelButtom}
                start={{ y: 0.0, x: 0.0 }}
                end={{ y: 0.0, x: 1.0 }}
            >
                <TouchableOpacity onPress={submitHandler} >
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={[styles.cancelButtonText, { color: '#fff' }]}>{submitText}</Text>
                        <Ionicons name="checkmark" size={25} color={"#fff"} />
                    </View>
                </TouchableOpacity>
            </LinearGradient>
        </View>
    );
};

const styles = StyleSheet.create({
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
    buttons: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        width: '100%',
        backgroundColor: '#fff',
        paddingTop: 20,
        paddingBottom: 30
    },

});

export default SubmitCancelButtons;