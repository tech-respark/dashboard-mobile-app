import React, { useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { FontSize, GlobalColors } from "../../../Styles/GlobalStyleConfigs";
import { TextInput, TouchableOpacity } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import { GlobalStyles } from "../../../Styles/Styles";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from "moment";
import DropdownApp from "../../../components/DropdownApp";

const CreateUser = () => {
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
        skin: "",
        hair: "",
        profession: "",
        pattern: ""
    });

    const handleFormChange = (name: string, value: string | Date) => {
        setForm({
            ...form,
            [name]: value
        });
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

                        <View style={[GlobalStyles.justifiedRow, styles.rowViews]}>
                            <View style={{ width: '45%' }}>
                                <Text style={styles.marginBt5}>Source</Text>
                                <DropdownApp selectedValue={form.source} setSelectedValue={(val: string) => { handleFormChange('source', val) }} options={[{ label: 'Facebook' }, { label: 'Insta' }, { label: 'Other' }]} />
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

                        <View style={[GlobalStyles.justifiedRow, styles.rowViews]}>
                            <View style={{ width: '45%' }}>
                                <Text style={styles.marginBt5}>Skin</Text>
                                <DropdownApp selectedValue={form.skin} setSelectedValue={(val: string) => { handleFormChange('skin', val) }} options={[{ label: 'Facebook' }, { label: 'Insta' }, { label: 'Other' }]} />
                            </View>
                            <View style={{ width: '45%' }}>
                                <Text style={styles.marginBt5}>Hair</Text>
                                <DropdownApp selectedValue={form.hair} setSelectedValue={(val: string) => { handleFormChange('hair', val) }} options={[{ label: 'Facebook' }, { label: 'Insta' }, { label: 'Other' }]} />
                            </View>
                        </View>

                        <View style={[GlobalStyles.justifiedRow, styles.rowViews]}>
                            <View style={{ width: '45%' }}>
                                <Text style={styles.marginBt5}>Profession</Text>
                                <DropdownApp selectedValue={form.profession} setSelectedValue={(val: string) => { handleFormChange('profession', val) }} options={[{ label: 'Facebook' }, { label: 'Insta' }, { label: 'Other' }]} />
                            </View>
                            <View style={{ width: '45%' }}>
                                <Text style={styles.marginBt5}>Pattern</Text>
                                <DropdownApp selectedValue={form.pattern} setSelectedValue={(val: string) => { handleFormChange('pattern', val) }} options={[{ label: 'Facebook' }, { label: 'Insta' }, { label: 'Other' }]} />
                            </View>
                        </View>

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
    rowViews:{ 
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