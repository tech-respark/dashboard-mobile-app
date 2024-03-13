import React, { FC } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { GlobalStyles } from "../Styles/Styles";
import { FontSize, GlobalColors } from "../Styles/GlobalStyleConfigs";

interface IAlertModal {
    modalVisible: boolean,
    setModalVisible: (val: boolean) => void,
    heading: string,
    description: string,
    onConfirm: () => void,
}

const AlertModal: FC<IAlertModal> = ({ modalVisible, setModalVisible, heading, description, onConfirm }) => {
    return (
        <Modal
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
                setModalVisible(!modalVisible);
            }}>
            <View style={[GlobalStyles.modalbackground]}>
                <View style={styles.modalView}>
                    <Text style={{ width: '100%', textAlign: 'center', fontWeight: '600', fontSize: FontSize.large, color: GlobalColors.blue, marginBottom: 10 }}>{heading}</Text>
                    <View style={{paddingVertical: 20, borderTopWidth: 1, borderColor: 'lightgray', width: '100%', alignItems: 'center'}}>
                        <Text>{description}</Text>
                    </View>
                    <View style={[GlobalStyles.justifiedRow, { justifyContent: "flex-end", width: "100%"}]}>
                        <Pressable style={[styles.buttonContainer, { marginRight: 20 }]}
                            onPress={() => { setModalVisible(false) }}
                        >
                            <Text style={styles.buttonText}>No</Text>
                        </Pressable>
                        <Pressable style={[styles.buttonContainer, { backgroundColor: GlobalColors.blue, paddingHorizontal: 10 }]}
                            onPress={()=>{
                                setModalVisible(false);
                                onConfirm();
                            }}
                        >
                            <Text style={[styles.buttonText, { color: '#fff' }]}>Yes</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalView: {
        width: '85%',
        backgroundColor: '#fff',
        paddingVertical: 20,
        paddingHorizontal: 20,
        borderRadius: 5
    },
    buttonContainer: {
        borderWidth: 1,
        borderColor: GlobalColors.blue,
        borderRadius: 5,
        width: '30%'
    },
    buttonText: {
        fontSize: FontSize.large,
        textAlign: "center",
        paddingVertical: 5,
        color: GlobalColors.blue
    },
});

export default AlertModal;