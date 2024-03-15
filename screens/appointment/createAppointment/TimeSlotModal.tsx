import React, { FC, useState } from "react";
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { GlobalStyles } from "../../../Styles/Styles";
import { FontSize, GlobalColors } from "../../../Styles/GlobalStyleConfigs";
import { Ionicons } from "@expo/vector-icons";

interface ITimeSlotModal {
    modalVisible: boolean,
    setModalVisible: (val: boolean) => void,
    isFrom: boolean,
    timeInterval: { [key: string]: string },
    setValue: (val: any) => void,
    serviceObj: {[key: string]: any}
}

const TimeSlotModal: FC<ITimeSlotModal> = ({ modalVisible, setModalVisible, isFrom, timeInterval, setValue, serviceObj }) => {
    let validationOccurred = false;

    const checkTimeValidation = (time: string) => {
        if (isFrom) {
            return true;
        }
        if (validationOccurred) {
            return true;
        }
        if (time === serviceObj.fromTime) {
            validationOccurred = true;
        }
        return false;
    };

    return (
        <Modal
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
                setModalVisible(!modalVisible);
            }}>
            <View style={[GlobalStyles.modalbackground]}>
                <View style={styles.modalView}>
                    <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
                        <TouchableOpacity style={{backgroundColor: GlobalColors.lightGray2, padding: 3, borderRadius: 20}}
                        onPress={()=>{setModalVisible(false)}}>
                            <Ionicons name="close" size={20} color={GlobalColors.error}/>
                        </TouchableOpacity>
                    </View>
                    <Text style={{textAlign: 'center', color: GlobalColors.grayDark}}>Select time {isFrom ? `before ${serviceObj.toTime}` : `after ${serviceObj.fromTime}`}</Text>
                    <ScrollView>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', margin: 10, justifyContent: 'space-evenly' }}>
                            {Object.keys(timeInterval).map((time: string, index: number) => (
                                checkTimeValidation(time) && 
                                <TouchableOpacity key={index} style={[{ borderRadius: 2, borderWidth: 1, margin: 8, borderColor: isFrom ? (serviceObj.fromTime==time ? GlobalColors.blue : 'lightgray') : (serviceObj.toTime==time ? GlobalColors.blue : 'lightgray'), width: '40%', alignItems: 'center' }]}
                                onPress={()=>{
                                    setValue(time);
                                    setModalVisible(false);
                                }}
                                >
                                    <Text style={{ padding: 10, fontSize: FontSize.large }}>{timeInterval[time]}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </ScrollView>

                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalView: {
        width: '80%',
        height: '50%',
        backgroundColor: '#fff',
        paddingVertical: 5,
        paddingHorizontal: 5,
        borderRadius: 5
    },
});

export default TimeSlotModal;