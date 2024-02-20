import React, { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { FontSize, GlobalColors } from "../../../../Styles/GlobalStyleConfigs";
import { GlobalStyles } from "../../../../Styles/Styles";

const AboutUser = () => {
    const [aboutUser, setAboutUser] = useState<string>("");

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
                    onPress={() => { }}
                >
                    <Text style={styles.buttonText}>Reset</Text>
                </Pressable>
                <Pressable style={[styles.buttonContainer, { backgroundColor: GlobalColors.blue }]}
                    onPress={()=>{setAboutUser("")}}
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