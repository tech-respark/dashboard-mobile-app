import React, { FC } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { GlobalStyles } from "../../../Styles/Styles";
import { FontSize, GlobalColors } from "../../../Styles/GlobalStyleConfigs";

interface IConfirmationModal {
    modalVisible: boolean, 
    setModalVisible: (val: boolean) => void,
    performAction: () => void,
}

const ConfirmationModal: FC<IConfirmationModal> = ({modalVisible, setModalVisible, performAction}) => {
    return (
        <Modal
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
            setModalVisible(!modalVisible);
        }}>
        <View style={[GlobalStyles.modalbackground]}>
            <View style={styles.modalView}>
                <Text style={{ textAlign: 'center', fontSize: FontSize.headingX, fontWeight: '500', marginBottom: 20 }}>{"Create & Confirm \n Appointment"}</Text>
                <Text style={{ textAlign: 'center', fontSize: FontSize.medium, fontWeight: '300' }}>{"Are you sure, you want to \n create & confirm an appointment"}</Text>
                <View style={{ width: '100%', backgroundColor: 'lightgray', height: 1, marginVertical: 20 }} />
                <View style={[GlobalStyles.justifiedRow, { width: '95%', marginBottom: 10 }]}>
                    <TouchableOpacity style={[styles.buttonContainer]}
                        onPress={() => { setModalVisible(false) }}>
                        <Text style={styles.buttonText}>No</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.buttonContainer, { backgroundColor: GlobalColors.blue }]}
                        onPress={performAction}>
                        <Text style={[styles.buttonText, { color: '#fff' }]}>Yes</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    </Modal>
    );
};

const styles = StyleSheet.create({
    modalView: {
        width: '80%',
        margin: 5,
        backgroundColor: '#fff',
        borderRadius: 5,
        padding: 20,
        alignItems: 'center',
    },
    buttonContainer: {
        borderWidth: 1,
        borderColor: GlobalColors.blue,
        borderRadius: 5,
        width: '45%'
    },
    buttonText: {
        fontSize: FontSize.large,
        textAlign: "center",
        paddingVertical: 5,
        color: GlobalColors.blue
    },
});

export default ConfirmationModal;