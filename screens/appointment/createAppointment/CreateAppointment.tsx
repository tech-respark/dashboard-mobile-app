import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { FontSize, GlobalColors } from "../../../Styles/GlobalStyleConfigs";
import { useIsFocused } from "@react-navigation/native";
import { useAppDispatch, useAppSelector } from "../../../redux/Hooks";
import { setShowUserProfileTopBar } from "../../../redux/state/UIStates";
import { GlobalStyles } from "../../../Styles/Styles";
import { environment } from "../../../utils/Constants";
import { selectBranchId, selectProductServiceCategories, selectTenantId } from "../../../redux/state/UserStates";
import { makeAPIRequest } from "../../../utils/Helper";
import Toast from "react-native-root-toast";
import { TimerWithBorderHeader } from "../../../components/HeaderTextField";
import ServiceSearchModal from "./ServiceSearchModal";
import Checkbox from 'expo-checkbox';
import AddUpdateUser from "./AddUpdateUser";
import GuestExpertDropdown from "./GuestExpertDropdown";
import { useCustomerData } from "../../../customHooks/AppointmentHooks";

type ServiceDetailsType = {
    service: { [key: string]: any },
    experts: { [key: string]: any }[],
    fromTime: string,
    toTime: string
};

const CreateAppointment = ({ navigation, route }: any) => {

    const dispatch = useAppDispatch();
    const storeId = useAppSelector(selectBranchId);
    const tenantId = useAppSelector(selectTenantId);
    const services = useAppSelector(selectProductServiceCategories);

    const [selectedCustomer, setSelectedCustomer] = useState<{ [key: string]: any }>({});
    const [instructions, setInstructions] = useState<string>('');
    const [enableSMS, setEnableSMS] = useState<boolean>(true);
    const [selectedModal, setSelectedModal] = useState<'guest' | 'service'>('guest');
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [createUserModal, setCreateUserModal] = useState<boolean>(false);
    const customers = useCustomerData(createUserModal);
    const [serviceDetails, setServiceDetails] = useState<ServiceDetailsType[]>([{
        service: {},
        experts: [route.params.staffObjects[route.params.selectedStaffIndex]],
        fromTime: route.params.from,
        toTime: route.params.to
    }]);


    const addEmptyService = () => {
        let lastObj = serviceDetails[serviceDetails.length - 1];
        console.log(lastObj)
        let errorMsg = Object.keys(lastObj.service).length == 0 ? "Select Service" : (lastObj.experts.length == 0 ? "Select Expert" : (!lastObj.fromTime ? "Select From Time" : (!lastObj.toTime ? "Select To Time" : null)));
        if (errorMsg) {
            Toast.show(errorMsg, { backgroundColor: GlobalColors.error, duration: Toast.durations.LONG });
            return;
        }
        setServiceDetails([...serviceDetails, { service: {}, experts: [], fromTime: "", toTime: "" }]);
    };

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: "Create Appointment",
            headerTitleAlign: 'left',
            headerLeft: () => (
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name={"chevron-back-outline"} size={20} style={{ marginHorizontal: 5, color: GlobalColors.blue }} />
                </TouchableOpacity>
            ),
        });
    }, [navigation]);

    return (
        <View style={{ flex: 1 }}>
            {createUserModal && <AddUpdateUser setModalVisible={setCreateUserModal} modalVisible={createUserModal}/>}
            <ScrollView style={styles.container}>
                <View style={[GlobalStyles.sectionView, { zIndex: selectedModal == 'guest' ? 2 : 1 }]}>
                    <View style={[GlobalStyles.justifiedRow, { marginBottom: 10 }]}>
                        <Text style={styles.headingText}>1. Guest Details</Text>
                        {
                            Object.keys(selectedCustomer).length > 0 ?
                                <Text style={{ color: GlobalColors.blue, textDecorationLine: 'underline' }}
                                    onPress={() => {
                                        dispatch(setShowUserProfileTopBar({ showUserProfileTopBar: false }));
                                        navigation.navigate("User History", { customerId: selectedCustomer.id })
                                    }}
                                >User History</Text> :
                                <View style={[GlobalStyles.justifiedRow]}>
                                    <Text style={{ color: GlobalColors.blue, marginRight: 10 }}>Add User</Text>
                                    <TouchableOpacity style={styles.circleIcon}
                                        onPress={() => {
                                            setCreateUserModal(true);
                                        }}>
                                        <Ionicons name="add" size={25} color="#fff" />
                                    </TouchableOpacity>
                                </View>
                        }
                    </View>
                    <GuestExpertDropdown data={customers} placeholderText="Search By Name Or Number" type="guest" setSelected={(val) => { setSelectedCustomer(val) }} selectedValue={selectedCustomer.firstName} />
                </View>

                <View style={[GlobalStyles.sectionView, { zIndex: selectedModal == 'service' ? 2 : 1 }]}>
                    <View style={[GlobalStyles.justifiedRow, { marginBottom: 10 }]}>
                        <Text style={styles.headingText}>2. Service Details</Text>
                        <View style={GlobalStyles.justifiedRow}>
                            <Text style={{ color: GlobalColors.blue, marginRight: 10 }}>Add Service</Text>
                            <TouchableOpacity style={styles.circleIcon}
                                onPress={addEmptyService}>
                                <Ionicons name="add" size={25} color="#fff" />
                            </TouchableOpacity>
                        </View>
                    </View>
                    {/* will be iterated for multiple */}
                    {
                        serviceDetails.map((serviceDetailsObj: ServiceDetailsType, sIndex: number) => (
                            <View style={{ borderWidth: 1, borderRadius: 5, borderColor: 'lightgray', padding: 5, marginVertical: 5 }}>
                                <ServiceSearchModal data={services} type="service" placeholderText="Search Service By Name" headerText={`Service ${sIndex + 1}`} setModal={setSelectedModal}
                                    setSelected={(val) => {
                                        console.log(val);
                                        setServiceDetails(prev => {
                                            const updated = [...prev];
                                            console.log(updated[sIndex].service)
                                            updated[sIndex].service = val;
                                            return updated
                                        })
                                    }}
                                />
                                {serviceDetailsObj.experts.map((expert: { [key: string]: any }, eIndex: number) => (
                                    <View style={GlobalStyles.justifiedRow}>
                                        <View style={{ width: eIndex == 0 ? '100%' : '90%' }}>
                                            <GuestExpertDropdown data={route.params.staffObjects} placeholderText="Search Expert" type="expert" selectedValue={expert.name} headerText={`Expert ${eIndex + 1}`}
                                                setSelected={(val) => {
                                                    setServiceDetails(prev => {
                                                        const updated = [...prev];
                                                        updated[sIndex].experts[eIndex] = val;
                                                        return updated
                                                    })
                                                }}
                                            />
                                        </View>
                                        {eIndex != 0 &&
                                            <TouchableOpacity style={{ backgroundColor: GlobalColors.error, borderRadius: 20, padding: 2 }}>
                                                <Ionicons name="close" size={20} color="#fff"
                                                    onPress={() => {
                                                        setServiceDetails(prev => {
                                                            const updated = [...prev];
                                                            console.log(eIndex)
                                                            updated[sIndex].experts.splice(eIndex, 1); //bug here
                                                            return updated
                                                        })
                                                    }} />
                                            </TouchableOpacity>
                                        }
                                    </View>
                                ))}
                                <Text style={{ color: GlobalColors.blue, textDecorationLine: 'underline' }}
                                    onPress={() => {
                                        if (Object.keys(serviceDetailsObj.experts[serviceDetailsObj.experts.length - 1]).length > 0) {
                                            setServiceDetails(prev => {
                                                const updated = [...prev];
                                                updated[sIndex].experts.push({});
                                                return updated;
                                            });
                                        } else {
                                            Toast.show(`Select Expert before adding more experts`, { backgroundColor: GlobalColors.error });
                                        }
                                    }}>Add Expert</Text>
                                <View style={[GlobalStyles.justifiedRow, { marginTop: 20 }]}>
                                    <TimerWithBorderHeader value={serviceDetails[sIndex].fromTime} header="From Time"
                                        setValue={(val) => {
                                            setServiceDetails(prev => {
                                                const updated = [...prev];
                                                updated[sIndex].fromTime = val;
                                                return updated;
                                            })
                                        }}
                                    />
                                    <TimerWithBorderHeader value={serviceDetails[sIndex].toTime} header="To Time"
                                        setValue={(val) => {
                                            setServiceDetails(prev => {
                                                const updated = [...prev];
                                                updated[sIndex].toTime = val;
                                                return updated;
                                            })
                                        }}
                                    />
                                </View>

                            </View>
                        ))
                    }


                </View>

                <View style={GlobalStyles.sectionView}>
                    <Text style={styles.headingText}>3. Instruction Details</Text>
                    <TextInput
                        style={styles.textInput}
                        numberOfLines={4}
                        multiline
                        placeholder="Enter Appointment Instructions"
                        value={instructions}
                        placeholderTextColor="gray"
                        underlineColorAndroid="transparent"
                        onChangeText={(val) => {
                            setInstructions(val);
                        }}
                    />
                </View>
            </ScrollView>
            <View style={{ backgroundColor: '#fff', padding: 20, alignItems: 'center' }}>
                <View style={[GlobalStyles.justifiedRow, { justifyContent: 'space-between', width: '100%', marginBottom: 20 }]}>
                    <View style={[GlobalStyles.justifiedRow, { width: '35%' }]}>
                        <Checkbox
                            color={"#4FACFE"}
                            style={{ borderColor: 'gray', borderRadius: 2, borderWidth: 0.5 }}
                            value={enableSMS}
                            onValueChange={() => setEnableSMS(!enableSMS)}
                        />
                        <Text>{"SMS\nConfirmation"}</Text>
                    </View>
                    <Text onPress={() => { }} style={{ color: GlobalColors.blue, textDecorationLine: 'underline' }}>Membership Validation</Text>
                </View>
                <TouchableOpacity style={{ width: '100%', backgroundColor: GlobalColors.blue, paddingVertical: 10, borderRadius: 5, marginBottom: 5 }}
                    onPress={() => {
                        //perform validation
                        setModalVisible(true);
                    }}
                >
                    <Text style={{ color: "#fff", textAlign: "center", fontSize: FontSize.large, fontWeight: '500' }}>Create</Text>
                </TouchableOpacity>
            </View>

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
                                onPress={() => {
                                    //perform api 
                                }}>
                                <Text style={[styles.buttonText, { color: '#fff' }]}>Yes</Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 5,
        paddingVertical: 10
    },
    textInput: {
        paddingHorizontal: 10,
        paddingVertical: 10,
        marginVertical: 15,
        borderWidth: 0.5,
        borderColor: 'lightgray',
        borderRadius: 2,
    },
    headingText: {
        fontSize: FontSize.large,
        fontWeight: '500'
    },
    circleIcon: {
        backgroundColor: GlobalColors.blue,
        borderRadius: 20, padding: 3
    },
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

export default CreateAppointment;