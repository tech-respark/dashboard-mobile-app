import React, { useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { FontSize, GlobalColors } from "../../../Styles/GlobalStyleConfigs";
import { TextInput, TouchableOpacity } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import { GlobalStyles } from "../../../Styles/Styles";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from "moment";
import DropdownApp from "../../../components/DropdownApp";
import { useDispatch } from "react-redux";
import { useAppDispatch, useAppSelector } from "../../../redux/Hooks";
import { selectSegments } from "../../../redux/state/AppointmentStates";

const CreateUser = () => {
    const dispatch = useAppDispatch();
    const segments = useAppSelector(selectSegments);

    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [isDatePickerVisible, setIsDatePickerVisible] = useState<boolean>(false);
    const [form, setForm] = useState<{ [key: string]: any }>({
        mobileNumber: "",
        name: "",
        email: "",
        dob: null,
        aniversaryDate: null,
        gstNumber: "",
        source: "",
        gender: "female",
    });

    const [selectedSegments, setSelectedSegments] = useState<{ [key: string]: any }>({});


    const handleFormChange = (name: string, value: string | Date) => {
        setForm({
            ...form,
            [name]: value
        });
    };

    const handleSegmentsChange = (name: string, value: { [key: string]: any }) => {
        setSelectedSegments({
            ...selectedSegments,
            [name]: value
        });
        console.log(selectedSegments)
    };

    const renderSegments = () => {
        const rows = [];
        const keys = Object.keys(segments);
        for (let i = 0; i < keys.length; i += 2) {
            rows.push(
                <View style={[GlobalStyles.justifiedRow, styles.rowViews]}>
                    <View style={{ width: '45%' }}>
                        <Text style={styles.marginBt5}>{keys[i]}</Text>
                        <DropdownApp selectedItem={selectedSegments[keys[i]]} setSelectedItem={(val: { [key: string]: any }) => { handleSegmentsChange(keys[i], val) }} options={segments[keys[i]]} labelKey={'segTypeName'} />
                    </View>
                    {
                        i + 1 < keys.length &&
                        <View style={{ width: '45%' }}>
                            <Text style={styles.marginBt5}>{keys[i + 1]}</Text>
                            <DropdownApp selectedItem={selectedSegments[keys[i + 1]]} setSelectedItem={(val: { [key: string]: any }) => { handleSegmentsChange(keys[i + 1], val) }} options={segments[keys[i + 1]]} labelKey={'segTypeName'} />
                        </View>
                    }
                </View>
            );
        }
        return rows;
    };

    return (
        <View style={[GlobalStyles.justifiedRow, { marginBottom: 10 }]}>
            <Text style={{ color: GlobalColors.blue, marginRight: 10 }}>Add User</Text>
            <TouchableOpacity style={styles.circleIcon}
                onPress={() => {
                    setModalVisible(true);
                }}>
                <Ionicons name="add" size={25} color="#fff" />
            </TouchableOpacity>
            <Modal
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.addUser}>Add User</Text>
                        <View style={styles.rowViews}>
                            <View style={{ flexDirection: 'row' }}>
                                <Text>Mobile Number</Text>
                                <Text style={{ color: 'red' }}>*</Text>
                            </View>
                            <TextInput
                                style={[styles.textInput]}
                                placeholder={'Mobile Number'}
                                value={form.mobileNumber}
                                placeholderTextColor="gray"
                                underlineColorAndroid="transparent"
                                onChangeText={(value) => handleFormChange('mobileNumber', value)}
                            />
                        </View>

                        <View style={styles.rowViews}>
                            <View style={{ flexDirection: 'row' }}>
                                <Text>Name</Text>
                                <Text style={{ color: 'red' }}>*</Text>
                            </View>
                            <TextInput
                                style={[styles.textInput]}
                                placeholder={'Mobile Number'}
                                value={form.mobileNumber}
                                placeholderTextColor="gray"
                                underlineColorAndroid="transparent"
                                onChangeText={(value) => handleFormChange('name', value)}
                            />
                        </View>

                        <View style={[GlobalStyles.justifiedRow, styles.rowViews]}>
                            <View style={{ width: '45%' }}>
                                <Text>Email</Text>
                                <TextInput
                                    style={[styles.textInput]}
                                    placeholder={'example@gmail.com'}
                                    value={form.mobileNumber}
                                    placeholderTextColor="gray"
                                    underlineColorAndroid="transparent"
                                    onChangeText={(value) => handleFormChange('email', value)}
                                />
                            </View>
                            <View style={{ width: '45%' }}>
                                <Text>DOB</Text>
                                <TouchableOpacity style={[styles.textInput]} onPress={() => { setIsDatePickerVisible(true) }}>
                                    <Text style={{ color: form.dob ? '#000' : 'gray' }}>{form.dob ? moment(form.dob).format('DD/MM/YYYY') : "DD/MM/YYYY"}</Text>
                                </TouchableOpacity>
                                <DateTimePickerModal
                                    isVisible={isDatePickerVisible}
                                    mode="date"
                                    onConfirm={(date) => {
                                        handleFormChange('dob', date)
                                        setIsDatePickerVisible(false);
                                    }}
                                    onCancel={() => setIsDatePickerVisible(false)}
                                />
                            </View>
                        </View>

                        <View style={[GlobalStyles.justifiedRow, styles.rowViews]}>
                            <View style={{ width: '45%' }}>
                                <Text>Anniversary Date</Text>
                                <TouchableOpacity style={[styles.textInput]} onPress={() => { setIsDatePickerVisible(true) }}>
                                    <Text style={{ color: form.aniversaryDate ? '#000' : 'gray' }}>{form.aniversaryDate ? moment(form.aniversaryDate).format('DD/MM/YYYY') : "DD/MM/YYYY"}</Text>
                                </TouchableOpacity>
                                <DateTimePickerModal
                                    isVisible={isDatePickerVisible}
                                    mode="date"
                                    onConfirm={(date) => {
                                        handleFormChange('aniversaryDate', date)
                                        setIsDatePickerVisible(false);
                                    }}
                                    onCancel={() => setIsDatePickerVisible(false)}
                                />
                            </View>
                            <View style={{ width: '45%' }}>
                                <Text>GST Number</Text>
                                <TextInput
                                    style={[styles.textInput]}
                                    placeholder={'GST No'}
                                    value={form.mobileNumber}
                                    placeholderTextColor="gray"
                                    underlineColorAndroid="transparent"
                                    onChangeText={(value) => handleFormChange('email', value)}
                                />
                            </View>
                        </View>
                        {renderSegments()}
                        <View style={[GlobalStyles.justifiedRow, { justifyContent: "flex-end", width: "100%" }]}>
                            <Pressable style={[styles.buttonContainer, { marginRight: 20 }]}
                                onPress={() => { setModalVisible(false) }}
                            >
                                <Text style={styles.buttonText}>Cancel</Text>
                            </Pressable>
                            <Pressable style={[styles.buttonContainer, { backgroundColor: GlobalColors.blue }]}
                                onPress={() => { }}
                            >
                                <Text style={[styles.buttonText, { color: '#fff' }]}>Add</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};


const styles = StyleSheet.create({
    addUser: {
        fontSize: FontSize.heading,
        fontWeight: '500',
        marginBottom: 20
    },
    rowViews: {
        width: '100%',
        marginBottom: 20
    },
    circleIcon: {
        backgroundColor: GlobalColors.blue,
        borderRadius: 20, padding: 3
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalView: {
        width: '95%',
        margin: 5,
        backgroundColor: '#fff',
        borderRadius: 5,
        padding: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 2,
        shadowRadius: 5,
        elevation: 5,
    },
    textInput: {
        width: '100%',
        padding: 10,
        borderWidth: 0.5,
        borderColor: 'lightgray',
        borderRadius: 2,
        marginTop: 5
    },
    buttonContainer: {
        borderWidth: 1,
        borderColor: GlobalColors.blue,
        borderRadius: 5,
        width: '35%'
    },
    buttonText: {
        fontSize: FontSize.medium,
        textAlign: "center",
        paddingVertical: 5,
        color: GlobalColors.blue
    },
    marginBt5: {
        marginBottom: 5
    }
});

export default CreateUser;