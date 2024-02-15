import React, { useEffect, useState } from "react";
import { ActivityIndicator, Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { FontSize, GlobalColors } from "../../../Styles/GlobalStyleConfigs";
import { TextInput, TouchableOpacity } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import { GlobalStyles } from "../../../Styles/Styles";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from "moment";
import { useAppSelector } from "../../../redux/Hooks";
import { selectCustomerSources, selectSegments } from "../../../redux/state/AppointmentStates";
import RadioButtonGroup from "../../../components/RadioButtonGroup";
import { REGULAR_EXP, environment } from "../../../utils/Constants";
import { makeAPIRequest } from "../../../utils/Helper";
import Toast from "react-native-root-toast";
import { selectBranchId, selectStoreCount, selectTenantId } from "../../../redux/state/UserStates";
import Checkbox from "expo-checkbox";
import CustomDropdown2 from "../../../components/CustomDropdown2";

const CreateUser = () => {
    const storeId = useAppSelector(selectBranchId);
    const tenantId = useAppSelector(selectTenantId);
    const segments = useAppSelector(selectSegments);
    const storeCount = useAppSelector(selectStoreCount);
    const sources = useAppSelector(selectCustomerSources);

    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [selectedDateLabel, setSelectedDateLabel] = useState<string>("");
    const [isDatePickerVisible, setIsDatePickerVisible] = useState<boolean>(false);
    const [form, setForm] = useState<{ [key: string]: any }>({});
    const [selectedSegments, setSelectedSegments] = useState<{ [key: string]: any }>({});
    const [segmentObject, setSegmentObject] = useState<{ [key: string]: any }>({});
    const [loader, setLoader] = useState<boolean>(false);

    const handleFormChange = (name: string, value: string | Date | boolean) => {
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
        setSegmentObject({
            ...segmentObject,
            [value.segId]: [value.id]
        });
    };

    const createUser = async () => {
        let isMobileValid = REGULAR_EXP.mobile.test(form.mobileNo);
        if (!isMobileValid || !form.firstName) {
            Toast.show(isMobileValid ? "Fill required fields" : "Invalid mobile number", { backgroundColor: GlobalColors.error, opacity: 1 });
            return
        }
        setLoader(true);
        const url = environment.guestUrl + `customers`;
        let data = {
            ...form,
            area: '',
            lastName: "",
            segments: segmentObject,
            storeId: storeId,
            tenantId: tenantId
        };
        let response = await makeAPIRequest(url, data, "POST");
        if (response) {
            setModalVisible(false);
            Toast.show("User Added", { backgroundColor: GlobalColors.success, opacity: 1 });
        }
        else
            Toast.show("Encountered Error", { backgroundColor: GlobalColors.error, opacity: 1 });
        setLoader(false);
    };

    const renderSegments = () => {
        const rows = [];
        const keys = Object.keys(segments!);
        for (let i = 0; i < keys.length; i += 2) {
            rows.push(
                <View style={[GlobalStyles.justifiedRow, styles.rowViews]}>
                    <View style={{ width: '45%' }}>
                        <Text style={styles.marginBt5}>{keys[i]}</Text>
                        <CustomDropdown2 setSelectedItem={(val: { [key: string]: any }) => { handleSegmentsChange(keys[i], val) }} options={segments![keys[i]]} labelKey={'segTypeName'} />
                    </View>
                    {
                        i + 1 < keys.length &&
                        <View style={{ width: '45%' }}>
                            <Text style={styles.marginBt5}>{keys[i + 1]}</Text>
                            <CustomDropdown2 setSelectedItem={(val: { [key: string]: any }) => { handleSegmentsChange(keys[i + 1], val) }} options={segments![keys[i + 1]]} labelKey={'segTypeName'} />
                        </View>
                    }
                </View>
            );
        }
        return rows;
    };

    useEffect(() => {
        setForm({
            mobileNo: "",
            firstName: "",
            email: "",
            dob: null,
            aniversaryDate: null,
            gstNumber: "",
            source: "",
            gender: "female",
            isGlobal: false
        })
        setSegmentObject({});
        setSelectedSegments({});
    }, [modalVisible])

    return (
        <View style={[GlobalStyles.justifiedRow]}>
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
                <View style={[GlobalStyles.modalbackground]}>
                    <View style={styles.modalView}>
                        <Text style={styles.addUser}>Add User</Text>
                        <View style={[styles.rowViews, GlobalStyles.justifiedRow]}>
                            <View style={{width: storeCount! > 1 ? '70%': '100%'}}>
                                <View style={{ flexDirection: 'row' }}>
                                    <Text>Mobile Number</Text>
                                    <Text style={{ color: 'red' }}>*</Text>
                                </View>
                                <TextInput
                                    style={[styles.textInput]}
                                    placeholder={'Mobile Number'}
                                    keyboardType={'phone-pad'}
                                    value={form.mobileNo}
                                    dataDetectorTypes={'phoneNumber'}
                                    placeholderTextColor="gray"
                                    underlineColorAndroid="transparent"
                                    onChangeText={(value) => handleFormChange('mobileNo', value)}
                                />
                            </View>
                            {
                                (storeCount && storeCount > 1) &&
                                <View style={[GlobalStyles.justifiedRow, {width: '25%'}]}>
                                    <Text>Is Global</Text>
                                    <Checkbox
                                        color={"#4FACFE"}
                                        style={{ borderColor: 'gray', borderRadius: 2, borderWidth: 0.5 }}
                                        value={form.isGlobal}
                                        onValueChange={() => handleFormChange('isGlobal', !form.isGlobal)}
                                    />
                                </View>
                            }
                        </View>

                        <View style={styles.rowViews}>
                            <View style={{ flexDirection: 'row' }}>
                                <Text>Name</Text>
                                <Text style={{ color: 'red' }}>*</Text>
                            </View>
                            <TextInput
                                style={[styles.textInput]}
                                placeholder={'Name'}
                                value={form.firstName}
                                placeholderTextColor="gray"
                                underlineColorAndroid="transparent"
                                onChangeText={(value) => handleFormChange('firstName', value)}
                            />
                        </View>

                        <View style={[GlobalStyles.justifiedRow, styles.rowViews]}>
                            <View style={{ width: '45%' }}>
                                <Text>Email</Text>
                                <TextInput
                                    style={[styles.textInput]}
                                    placeholder={'example@gmail.com'}
                                    value={form.email}
                                    placeholderTextColor="gray"
                                    underlineColorAndroid="transparent"
                                    onChangeText={(value) => handleFormChange('email', value)}
                                />
                            </View>
                            <View style={{ width: '45%' }}>
                                <Text>DOB</Text>
                                <TouchableOpacity style={[styles.textInput]} onPress={() => {
                                    setSelectedDateLabel('dob')
                                    setIsDatePickerVisible(true)
                                }}>
                                    <Text style={{ color: form.dob ? '#000' : 'gray' }}>{form.dob ? moment(form.dob).format('DD/MM/YYYY') : "DD/MM/YYYY"}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={[GlobalStyles.justifiedRow, styles.rowViews]}>
                            <View style={{ width: '45%' }}>
                                <Text>Anniversary Date</Text>
                                <TouchableOpacity style={[styles.textInput]} onPress={() => {
                                    setSelectedDateLabel('aniversaryDate')
                                    setIsDatePickerVisible(true)
                                }}>
                                    <Text style={{ color: form.aniversaryDate ? '#000' : 'gray' }}>{form.aniversaryDate ? moment(form.aniversaryDate).format('DD/MM/YYYY') : "DD/MM/YYYY"}</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{ width: '45%' }}>
                                <Text>GST Number</Text>
                                <TextInput
                                    style={[styles.textInput]}
                                    placeholder={'GST No'}
                                    value={form.gstNumber}
                                    placeholderTextColor="gray"
                                    underlineColorAndroid="transparent"
                                    onChangeText={(value) => handleFormChange('gstNumber', value)}
                                />
                            </View>
                        </View>
                        <DateTimePickerModal
                            isVisible={isDatePickerVisible}
                            mode="date"
                            onConfirm={(date) => {
                                handleFormChange(selectedDateLabel, date)
                                setIsDatePickerVisible(false);
                            }}
                            onCancel={() => setIsDatePickerVisible(false)}
                        />
                        <View style={[GlobalStyles.justifiedRow, styles.rowViews]}>
                            <View style={{ width: '45%' }}>
                                <Text>Source</Text>
                                <CustomDropdown2 setSelectedItem={(val: { [key: string]: any }) => { handleFormChange('source', val.name)}} options={sources!} labelKey={'name'} />
                            </View>
                            <View style={{ width: '45%' }}>
                                <Text>Gender</Text>
                                <RadioButtonGroup
                                    options={["female", "male"]}
                                    selectedOption={form.gender}
                                    onSelect={(val: string) => {
                                        handleFormChange('gender', val)
                                    }}
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
                                onPress={async () => { await createUser() }}
                            >
                                <Text style={[styles.buttonText, { color: '#fff' }]}>Add</Text>
                            </Pressable>
                        </View>
                    </View>
                    {loader &&
                        <View style={GlobalStyles.isLoading}>
                            <ActivityIndicator color={GlobalColors.blue} size={"large"} />
                        </View>
                    }
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