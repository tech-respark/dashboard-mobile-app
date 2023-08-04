import React, { FC, useState } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Button, Modal, Text, View } from "react-native";
import { FontSize, GlobalColors, GradientButtonColor } from "../../../Styles/GlobalStyleConfigs";
import Checkbox from "expo-checkbox";
import { LinearGradient } from "expo-linear-gradient";

type WeeklyOffModal = {
    weeklyOff: string[],
    updateWeeklyOff: (weeklyOffList: string[]) => void,
    modalVisible: boolean,
    toggleModal: () => void,
};

const DayCheckbox = ({ value, onValueChange, label }: any) => (
    <View style={{ marginRight: 10, flexDirection: 'row' }}>
        <Checkbox
            value={value}
            onValueChange={onValueChange}
            color={value ? GlobalColors.blue : undefined}
        />
        <Text style={{ paddingHorizontal: 5, fontWeight: '300', color: 'gray', textTransform: 'capitalize' }}>{label}</Text>
    </View>
)

const WeeklyOffModal: FC<WeeklyOffModal> = ({ weeklyOff, updateWeeklyOff, modalVisible, toggleModal }) => {
    const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const [selectedDays, setSelectedDays] = useState<string[]>(weeklyOff);

    const toggleDay = (day: string) => {
        const updatedDays = selectedDays.includes(day)
          ? selectedDays.filter((d) => d !== day)
          : [...selectedDays, day];
        setSelectedDays(updatedDays);
      };

    return (
        <Modal
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
                toggleModal();
            }}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={{ fontSize: FontSize.heading, fontWeight: '500', marginBottom: 30 }}>Set Weekly Off</Text>
                    <View style={{ paddingBottom: 30, borderBottomWidth: 0.5, borderColor: 'lightgray', width: '80%' }}>
                        {Array.from({ length: 4 }, (_, rowIndex) => (
                            <View key={rowIndex} style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 15 }}>
                                {daysOfWeek.slice(rowIndex * 2, (rowIndex + 1) * 2).map((day, index) => (
                                    <DayCheckbox
                                        key={index}
                                        value={selectedDays.includes(day)}
                                        onValueChange={() => toggleDay(day)}
                                        label={day}
                                    />
                                ))}
                            </View>
                        ))}
                    </View>
                    <View style={styles.buttons}>
                        <TouchableOpacity onPress={() => {
                            setSelectedDays(weeklyOff);
                            toggleModal();
                        }} style={styles.cancelButtom}>
                            <Text style={[styles.cancelButtonText, { color: GlobalColors.blue }]}>Cancel</Text>
                        </TouchableOpacity>
                        <LinearGradient
                            colors={GradientButtonColor}
                            style={styles.cancelButtom}
                            start={{ y: 0.0, x: 0.0 }}
                            end={{ y: 0.0, x: 1.0 }}
                        >
                            <TouchableOpacity onPress={() => {
                                updateWeeklyOff(selectedDays);
                                toggleModal();
                            }} >
                                <Text style={[styles.cancelButtonText, { color: '#fff' }]}>Save</Text>
                            </TouchableOpacity>
                        </LinearGradient>
                    </View>


                </View>
            </View>

        </Modal>
    );
};


const styles = StyleSheet.create({
    cancelButtom: {
        borderWidth: 1,
        paddingVertical: 5,
        width: '40%',
        alignItems: 'center',
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
        marginTop: 20,
        justifyContent: 'space-evenly', width: '100%'
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        elevation: 5,
        width: '80%'

    },
});

export default WeeklyOffModal;