import React, { FC, useState } from "react";
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { GlobalStyles } from "../../../Styles/Styles";
import { FontSize, GlobalColors } from "../../../Styles/GlobalStyleConfigs";

interface ITimeSlotModal {
    modalVisible: boolean,
    setModalVisible: (val: boolean) => void,
    isFrom: boolean,
    timeInterval: { [key: string]: string },
    setValue: (val: any) => void,
    serviceObj: {[key: string]: any}
}

const TimeSlotModal: FC<ITimeSlotModal> = ({ modalVisible, setModalVisible, isFrom, timeInterval, setValue, serviceObj }) => {
    return (
        <Modal
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
                setModalVisible(!modalVisible);
            }}>
            <View style={[GlobalStyles.modalbackground]}>
                <View style={styles.modalView}>
                    <Text style={{textAlign: 'center', color: GlobalColors.grayDark}}>Select time {isFrom ? `before ${serviceObj.toTime}` : `after ${serviceObj.fromTime}`}</Text>
                    <ScrollView>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', margin: 10, justifyContent: 'space-evenly' }}>
                            {Object.keys(timeInterval).map((time: string, index: number) => (
                                //logic to set after time 
                                <TouchableOpacity key={index} style={[{ borderRadius: 2, borderWidth: 1, margin: 8, borderColor: isFrom ? (serviceObj.fromTime==time ? GlobalColors.blue : 'lightgray') : (serviceObj.toTime==time ? GlobalColors.blue : 'lightgray'), width: '40%' }]}
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
        paddingVertical: 20,
        paddingHorizontal: 20,
        borderRadius: 5
    },
});

export default TimeSlotModal;