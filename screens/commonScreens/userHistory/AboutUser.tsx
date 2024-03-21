import React, { FC, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { FontSize, GlobalColors } from "../../../Styles/GlobalStyleConfigs";
import { GlobalStyles } from "../../../Styles/Styles";
import { useAppDispatch } from "../../../redux/Hooks";
import { setIsLoading } from "../../../redux/state/UIStates";
import { makeAPIRequest } from "../../../utils/Helper";
import { environment } from "../../../utils/Constants";
import Toast from "react-native-root-toast";

interface IAboutUser {
    customer: { [key: string]: any },
    setCustomer: (val: any) => void,
}

const AboutUser: FC<IAboutUser> = ({customer, setCustomer}) => {
    const dispatch = useAppDispatch();
    const [aboutUser, setAboutUser] = useState<string>(customer.notes);

    const updateAboutUser = async() => {
        dispatch(setIsLoading({ isLoading: true }));
        const url = environment.guestUrl + `customers`;
        let tempCustomer = {...customer};
        tempCustomer["notes"] = aboutUser
        let response = await makeAPIRequest(url, tempCustomer, "POST");
        if (response) {
            setCustomer(response);
            Toast.show("User information updated", { backgroundColor: GlobalColors.success, opacity: 1 });
        }
        else
            Toast.show("Encountered Error", { backgroundColor: GlobalColors.error, opacity: 1 });
        dispatch(setIsLoading({ isLoading: true }));
    };

    return (
        <View style={{ width: '100%', flex: 1, alignItems: 'center', padding: 10 }}>
            <View style={styles.textInputView}>
                <TextInput
                    placeholder=""
                    value={aboutUser}
                    placeholderTextColor="lightgray"
                    underlineColorAndroid="transparent"
                    onChangeText={setAboutUser}
                    multiline
                />
            </View>
            <View style={[GlobalStyles.justifiedRow, { justifyContent: "flex-end", width: "100%"}]}>
                <Pressable style={[styles.buttonContainer, { marginRight: 20 }]}
                   onPress={()=>{setAboutUser("")}}
                >
                    <Text style={styles.buttonText}>Reset</Text>
                </Pressable>
                <Pressable style={[styles.buttonContainer, { backgroundColor: GlobalColors.blue }]}
                 onPress={updateAboutUser}
                >
                    <Text style={[styles.buttonText, { color: '#fff' }]}>Update</Text>
                </Pressable>
            </View>

        </View>
    );
};

const styles = StyleSheet.create({
    textInputView: {
        height: '15%',
        width: '100%',
        paddingHorizontal: 8,
        borderWidth: 1,
        borderColor: GlobalColors.blue,
        borderRadius: 5,
        marginBottom: 15
    },
    buttonContainer: {
        borderWidth: 1,
        borderColor: GlobalColors.blue,
        borderRadius: 5,
        width: '35%'
    },
    buttonText: {
        fontSize: FontSize.large,
        fontWeight: '500',
        textAlign: "center",
        paddingVertical: 8,
        color: GlobalColors.blue
    },
});

export default AboutUser;