import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { FontSize, GlobalColors } from "../../../Styles/GlobalStyleConfigs";
import { useAppDispatch, useAppSelector } from "../../../redux/Hooks";
import { setIsLoading, setShowUserProfileTopBar } from "../../../redux/state/UIStates";
import { GlobalStyles } from "../../../Styles/Styles";
import { APPOINTMENT_CANCELLED, APPOINTMENT_CHECKIN, APPOINTMENT_CONFIRMED, APPOINTMENT_CREATED, APPOINTMENT_ONLINE, APPOINTMENT_UPDATED, DEFAULT_SERVICE_DURATION, environment } from "../../../utils/Constants";
import { selectBranchId, selectCurrentStoreConfig, selectProductServiceCategories, selectSMSConfig, selectTenantId, selectUserData } from "../../../redux/state/UserStates";
import { makeAPIRequest } from "../../../utils/Helper";
import Toast from "react-native-root-toast";
import Checkbox from 'expo-checkbox';
import AddUpdateUser from "../common/AddUpdateUser";
import GuestExpertDropdown from "./GuestExpertDropdown";
import { useCustomerData } from "../../../customHooks/AppointmentHooks";
import { ServiceDetailsType } from "../../../utils/Types";
import { calculateTaxes } from "../../../utils/Appointment";
import moment from "moment";
import { selectSelectedGuest, setSelectedGuest } from "../../../redux/state/AppointmentStates";
import MembershipValidationModal from "./MembershipValidationModal";
import CancelAppointmentButton from "./CancelAppointmentButton";
import AlertModal from "../../../components/AlertModal";
import Header from "./Header";
import { TimerWithBorderHeader } from "../../../components/HeaderTextField";
import ServiceSearchModal from "./ServiceSearchModal";
import CheckboxWithTitle from "../../../components/CheckboxWithTitle";


const CreateEditAppointment = ({ navigation, route }: any) => {

    const isCreate = route.params.isCreate;
    const appointmentDetails = route.params.appointment;
    const stage = route.params.stage;

    const dispatch = useAppDispatch();
    const storeId = useAppSelector(selectBranchId);
    const tenantId = useAppSelector(selectTenantId);
    const storeConfig = useAppSelector(selectCurrentStoreConfig);
    const loggedInUser = useAppSelector(selectUserData);
    const guestDetails = useAppSelector(selectSelectedGuest) ?? null;
    const smsConfig = useAppSelector(selectSMSConfig);
    const services = useAppSelector(selectProductServiceCategories);

    const [selectedCustomer, setSelectedCustomer] = useState<{ [key: string]: any } | null>(null);
    const [instructions, setInstructions] = useState<string>('');
    const [enableSMS, setEnableSMS] = useState<boolean>(smsConfig!.appointmentConfirmed ?? false);
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [membershipValidationModal, setMembershipValidationModal] = useState<boolean>(false);
    const [createUserModal, setCreateUserModal] = useState<boolean>(false);
    const customers = useCustomerData(createUserModal);
    const [serviceDetails, setServiceDetails] = useState<ServiceDetailsType[]>([]);
    const [isUpdate, setIsUpdate] = useState<boolean>(false);

    const addEmptyService = () => {
        let lastObj = serviceDetails[serviceDetails.length - 1];
        let errorMsg = lastObj.service && Object.keys(lastObj.service).length == 0 ? "Select Service" : (lastObj.experts.length == 0 ? "Select Expert" : (!lastObj.fromTime ? "Select From Time" : (!lastObj.toTime ? "Select To Time" : null)));
        if (errorMsg) {
            Toast.show(errorMsg, { backgroundColor: GlobalColors.error, duration: Toast.durations.LONG });
            return;
        }
        setServiceDetails([...serviceDetails, { service: {}, experts: [{}], fromTime: "", toTime: "" }]);
    };

    const calculateContributions = (serviceObj: { [key: string]: any }, duration: number) => {
        let contributions: any = [];
        serviceObj.experts.length > 0 && serviceObj.experts.map((contributor: any, index: number) => {
            contributions.push({
                slot: `${serviceObj.fromTime}-${serviceObj.toTime}`,
                duration: duration || DEFAULT_SERVICE_DURATION,
                expertId: contributor.staffId,
                expertName: contributor.name,
                workPercentage: (100 / serviceObj.experts.length).toFixed(2),
                workAmount: serviceObj.service.salePrice || serviceObj.service.price,
                specialist: index == 0 ? true : false
            })
        });
        return contributions;
    };

    const formValidation = () => {
        if ((isCreate && !selectedCustomer) || !guestDetails) {
            Toast.show("Select Customer", { backgroundColor: GlobalColors.error, opacity: 1.0 });
            return false;
        }
        let isValid = true;
        serviceDetails.map((service: any, index: number) => {
            let msg = !service.service ? "Select Service" : service.experts.length == 0 ? "Select Expert" : !service.fromTime ? "Select From Time" : !service.toTime ? "Select To Time" : "";
            if (msg) {
                Toast.show(msg, { backgroundColor: GlobalColors.error, opacity: 1.0 });
                isValid = false;
            }
        });
        return isValid;
    };

    const createIndividualExpertService = (serviceObj: any) => {
        const duration = serviceObj.service.durationType === 'hrs' ? serviceObj.service.duration * 60 : serviceObj.service.duration
        const taxes = calculateTaxes(serviceObj.service.salePrice || serviceObj.service.price, storeConfig!);
        const individualAppointmentObj = {
            "appointmentTime": serviceObj.fromTime,
            "duration": duration,
            "serviceCategory": serviceObj.service.serviceCategory,
            "service": serviceObj.service.name || serviceObj.service.service || serviceObj.serviceQuery, //update this
            "slot": `${serviceObj.fromTime}-${serviceObj.toTime}`,
            "expertId": serviceObj.experts[0].staffId,
            "expertName": serviceObj.experts[0].name,
            "price": serviceObj.service.price,
            "salePrice": serviceObj.service.salePrice,
            "billingPrice": serviceObj.service.salePrice || serviceObj.service.price,
            "quantity": 1,
            "serviceCategoryId": serviceObj.service.serviceCategoryId,
            "serviceId": serviceObj.service.id,
            "txchrgs": taxes,
            "variations": serviceObj.service.variations,
            "consumables": serviceObj.service.consumables,
            "contributions": calculateContributions(serviceObj, duration)
        }
        return individualAppointmentObj;
    };

    const getAppointmentStatus = (actionType: string, statusList: { [key: string]: any }[]) => {
        let newStatus = {
            staff: loggedInUser!.id,
            createdOn: new Date().toISOString(),
            status: actionType
        }
        statusList.push(newStatus);
        return statusList;
    };

    const getSMSKeys = () => {
        return {
            appointmentCancelled: smsConfig!.appointmentCancelled,
            appointmentConfirmed: enableSMS, //for creating confirmation sms
            combineFeedbackAndInvoice: smsConfig!.combineFeedbackAndInvoice,
            smsForAppointments: smsConfig!.smsForAppointments,
        }
    };

    const createAppointmentPayload = (actionType: string) => {
        let appointmentsList: any = [];
        serviceDetails.map((service: any) => {
            appointmentsList.push(createIndividualExpertService(service));
        })
        const appointmentObj: any = {
            //some new keys are there to be added later
            "appointmentDay": appointmentDetails?.appointmentDay ?? moment(route.params.selectedDate, 'YYYY-MM-DD').toISOString(),
            "appointmentTime": appointmentsList[0].appointmentTime,
            "duration": appointmentsList[0].duration,
            "instruction": instructions,
            "instrImages": [], //what is use of this 
            "slot": appointmentsList[0].slot,
            "orderId": '',
            "invoiceId": '',
            "expertId": appointmentsList[0].expertId,
            "expertName": appointmentsList[0].expertName, //not in update
            "storeId": storeId,
            "tenantId": tenantId,
            "store": storeConfig!.store,
            "tenant": storeConfig!.tenant,
            "guestId": appointmentDetails?.guestId ?? guestDetails!.id,
            "guestName": appointmentDetails?.guestName ?? guestDetails!.lastName ? `${guestDetails!.firstName} ${guestDetails!.lastName}` : guestDetails!.firstName,
            "guestMobile": appointmentDetails?.guestMobile ?? guestDetails!.mobileNo,
            "guestEmail": appointmentDetails?.guestEmail ?? guestDetails!.email,
            "guestGSTN": appointmentDetails?.guestGSTN ?? guestDetails!.gstN,
            "bookedFor": appointmentDetails?.bookedFor ?? (guestDetails!.bookedFor || null),
            "storeLocation": appointmentDetails?.storeLocation ?? '',
            "createdOn": appointmentDetails?.createdOn ?? new Date().toISOString(),
            "expertAppointments": appointmentsList,
            "noOfRemindersSent": appointmentDetails?.noOfRemindersSent ?? 0,
            "rescheduled": false,
            "feedbackLinkShared": false,
            "type": "POS",
            "smsKeys": isCreate || stage == APPOINTMENT_ONLINE ? getSMSKeys() : appointmentDetails?.smsKeys,
            "status": isCreate || stage == APPOINTMENT_ONLINE ? getAppointmentStatus(actionType, isCreate ? [] : appointmentDetails?.status) : appointmentDetails?.status
        };
        if (!isCreate) {
            appointmentObj['id'] = appointmentDetails?.id
        }
        return appointmentObj;
    };

    const appointmentAPICall = async (actionType: string) => {
        dispatch(setIsLoading({ isLoading: true }));
        const url = environment.txnUrl + `appointments`;
        let payload = null;
        if (actionType == APPOINTMENT_CONFIRMED || actionType == APPOINTMENT_UPDATED) {
            payload = createAppointmentPayload(actionType);
        } else {
            //marking as checked IN
            payload = { ...appointmentDetails };
            payload["status"] = getAppointmentStatus(actionType, payload["status"]);
        }
        let response = await makeAPIRequest(url, payload, "POST");
        dispatch(setIsLoading({ isLoading: false }));
        setModalVisible(false);
        if (response) {
            Toast.show(isCreate ? `Appointment created successfuly` : stage == APPOINTMENT_ONLINE ? "Appointment Confirmed" : `Appointment marked Checked In`, { backgroundColor: GlobalColors.success, opacity: 1.0 });
            navigation.goBack();
        } else {
            Toast.show("Encountered Error", { backgroundColor: GlobalColors.error, opacity: 1.0 });
        }
    };

    const getGuestDetails = async (customerId: string) => {
        const url = environment.guestUrl + `customers/userbyguestid?tenantId=${tenantId}&storeId=${storeId}&guestId=${customerId}`;
        let response = await makeAPIRequest(url, null, "GET");
        if (response) {
            dispatch(setSelectedGuest({ selectedGuest: response }));
        } else {
            dispatch(setSelectedGuest({ selectedGuest: {} }));
            // Toast.show("Encountered issue", { backgroundColor: GlobalColors.error });
        }
    };

    const setUpdateData = () => {
        setInstructions(appointmentDetails.instruction);
        const mapContributions = (contribution: { [key: string]: any }) => {
            const foundExpert = route.params.staffObjects.find((staff: any) => staff.staffId === contribution.expertId);
            return foundExpert ? foundExpert : null;
        };
        const mapExpertAppointment = (expertAppointment: { [key: string]: any }) => {
            const slots = expertAppointment.slot.split('-');
            const experts = expertAppointment.contributions?.map(mapContributions) ?? [{}];
            const service = {
                salePrice: expertAppointment.salePrice,
                price: expertAppointment.price,
                serviceCategory: expertAppointment.serviceCategory,
                name: expertAppointment.service,
                serviceCategoryId: expertAppointment.serviceCategoryId,
                id: expertAppointment.serviceId,
                variations: expertAppointment.variations,
                consumables: expertAppointment.consumables,
                duration: expertAppointment.duration
            };
            return {
                service,
                fromTime: slots[0],
                toTime: slots[1] ?? "",
                experts
            };
        };
        const servicesList: ServiceDetailsType[] = appointmentDetails.expertAppointments.map(mapExpertAppointment);
        setServiceDetails(servicesList);
    };

    useEffect(() => {
        if (isCreate) {
            setServiceDetails([{
                service: null,
                experts: [route.params.staffObjects[route.params.selectedStaffIndex]],
                fromTime: route.params.from,
                toTime: route.params.to
            }])
        } else if (appointmentDetails && appointmentDetails.guestId) {
            getGuestDetails(appointmentDetails.guestId);
            setUpdateData();
        }
    }, []);

    //only used for create
    useEffect(() => {
        if (isCreate && selectedCustomer) {
            Object.keys(selectedCustomer).length > 0 ? getGuestDetails(selectedCustomer!.id) : dispatch(setSelectedGuest({ selectedGuest: {} }));
        }
    }, [selectedCustomer]);

    return (
        <View style={{ flex: 1 }}>
            <Header navigation={navigation} isCreate={isCreate} stage={stage} guestName={guestDetails!.firstName} appointmentId={isCreate ? null : appointmentDetails.id} />
            {createUserModal && <AddUpdateUser setModalVisible={setCreateUserModal} modalVisible={createUserModal} />}
            <ScrollView style={styles.container}>
                <View style={[GlobalStyles.sectionView]}>
                    <View style={[GlobalStyles.justifiedRow, { marginBottom: 10 }]}>
                        <Text style={styles.headingText}>1. Guest Details</Text>
                        {
                            (!isCreate || selectedCustomer) && guestDetails ?
                                <Text style={{ color: GlobalColors.blue, textDecorationLine: 'underline' }}
                                    onPress={() => {
                                        dispatch(setShowUserProfileTopBar({ showUserProfileTopBar: false }));
                                        navigation.navigate("User History", { guestDetails: guestDetails })
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
                    {
                        isCreate ?
                            <GuestExpertDropdown data={customers} placeholderText="Search By Name Or Number" type="guest" setSelected={(val) => { setSelectedCustomer(val); setSelectedCustomer(val); }} selectedValue={selectedCustomer ? selectedCustomer.firstName : null} />
                            :
                            <View style={{ marginHorizontal: 5 }}>
                                <Text style={{ fontWeight: '500' }}>{appointmentDetails.guestName}</Text>
                                <Text>{appointmentDetails.guestMobile}</Text>
                            </View>
                    }
                </View>

                <View style={[GlobalStyles.sectionView]}>
                    <View style={[GlobalStyles.justifiedRow, { marginBottom: 10 }]}>
                        <Text style={styles.headingText}>2. Service Details</Text>
                        <View style={GlobalStyles.justifiedRow}>
                            <Text style={{ color: GlobalColors.blue, marginRight: 10 }}>Add Service</Text>
                            <TouchableOpacity style={styles.circleIcon}
                                onPress={() => {
                                    if (formValidation())
                                        addEmptyService();
                                }}>
                                <Ionicons name="add" size={25} color="#fff" />
                            </TouchableOpacity>
                        </View>
                    </View>
                    {
                        serviceDetails.length > 0 ? serviceDetails.map((serviceDetailsObj: ServiceDetailsType, sIndex: number) => (
                            <View style={[{ borderWidth: 1, borderRadius: 5, borderColor: 'lightgray', padding: 10, marginVertical: 8 }, GlobalStyles.shadow]} key={sIndex}>
                                {serviceDetails.length > 1 &&
                                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end', width: '100%' }}>
                                        <TouchableOpacity style={{ backgroundColor: GlobalColors.lightGray2, padding: 3, borderRadius: 20 }}
                                            onPress={() => {
                                                setServiceDetails(prev => {
                                                    const updated = [...prev];
                                                    updated.splice(sIndex, 1);
                                                    return updated
                                                })
                                            }}>
                                            <Ionicons name="trash-outline" color={GlobalColors.error} size={20} />
                                        </TouchableOpacity>
                                    </View>
                                }

                                <ServiceSearchModal data={services!} headerText={`Service ${sIndex + 1}`} selectedValue={serviceDetailsObj.service?.name} gender={guestDetails?.gender}
                                    setSelectedValue={(val) => {
                                        setServiceDetails(prev => {
                                            const updated = [...prev];
                                            updated[sIndex].service = val;
                                            return updated
                                        })
                                    }}
                                />
                                {serviceDetailsObj.experts.map((expert: { [key: string]: any }, eIndex: number) => {
                                    return (
                                        <View style={GlobalStyles.justifiedRow} key={eIndex}>
                                            <View style={{ width: eIndex == 0 ? '100%' : '90%' }}>
                                                <GuestExpertDropdown data={route.params.staffObjects} placeholderText="Search Expert" type="expert" selectedValue={expert.name} headerText={`Expert ${eIndex + 1}`}
                                                    currentExperts={serviceDetailsObj.experts}
                                                    setSelected={(val) => {
                                                        setServiceDetails(prev => {
                                                            const updated = [...prev];
                                                            updated[sIndex].experts[eIndex] = val ?? {};
                                                            return updated
                                                        })
                                                    }}
                                                />
                                            </View>
                                            {eIndex != 0 &&
                                                <TouchableOpacity style={{ backgroundColor: GlobalColors.lightGray2, borderRadius: 20, padding: 2 }}>
                                                    <Ionicons name="close" size={20} color={GlobalColors.error}
                                                        onPress={() => {
                                                            setServiceDetails(prev => {
                                                                const updated = [...prev];
                                                                updated[sIndex].experts.splice(eIndex, 1); //bug here
                                                                return updated
                                                            })
                                                        }} />
                                                </TouchableOpacity>
                                            }
                                        </View>
                                    )
                                })
                                }
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
                                    <TimerWithBorderHeader header="From Time" isFrom={true}
                                        serviceObj={serviceDetailsObj}
                                        setValue={(val) => {
                                            setServiceDetails(prev => {
                                                const updated = [...prev];
                                                updated[sIndex].fromTime = val;
                                                return updated;
                                            })
                                        }}
                                    />
                                    <TimerWithBorderHeader header="To Time" isFrom={false}
                                        serviceObj={serviceDetailsObj}
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
                        )) :
                            <View style={{ alignItems: 'center', height: '100%', justifyContent: 'center' }}>
                                <Text>Loading</Text>
                                <ActivityIndicator color={GlobalColors.blue} />
                            </View>
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
            <View style={{ backgroundColor: '#fff', paddingHorizontal: 20, paddingVertical: 10, alignItems: 'center' }}>
                {
                    (isCreate || stage == APPOINTMENT_ONLINE) ?
                        <View style={[GlobalStyles.justifiedRow, styles.spaceBtView]}>
                            <CheckboxWithTitle value={enableSMS} setValue={setEnableSMS} msg={`SMS\nConfirmation`} />
                            {
                                isCreate &&
                                <>
                                    {!selectedCustomer && <Text onPress={() => { setMembershipValidationModal(true) }} style={{ color: GlobalColors.blue, textDecorationLine: 'underline' }}>Membership Validation</Text>}
                                    {membershipValidationModal && <MembershipValidationModal modalVisible={membershipValidationModal} setModalVisible={setMembershipValidationModal} setCustomer={(val) => { setSelectedCustomer(val) }} />}
                                </>
                            }
                        </View>
                        :
                        stage != APPOINTMENT_CANCELLED &&
                        <View style={[GlobalStyles.justifiedRow, { width: '100%', marginBottom: 10 }]}>
                            <TouchableOpacity style={[styles.buttonView, { width: '45%', borderWidth: 1, borderColor: GlobalColors.blue }]} onPress={() => {
                                if (formValidation()) {
                                    setIsUpdate(true);
                                    setModalVisible(true);
                                }
                            }}>
                                <Text style={styles.buttonText}>Update</Text>
                            </TouchableOpacity>
                            <CancelAppointmentButton cancelSMSDefault={smsConfig!.appointmentCancelled} appointmentDetails={appointmentDetails} navigation={navigation} />
                        </View>
                }
                {
                    stage == APPOINTMENT_ONLINE ?
                        <View style={[GlobalStyles.justifiedRow, { width: '100%' }]}>
                            <CancelAppointmentButton cancelSMSDefault={smsConfig!.appointmentCancelled} appointmentDetails={appointmentDetails} navigation={navigation} />
                            <TouchableOpacity style={[styles.onlineAppButton, { backgroundColor: GlobalColors.blue }]} onPress={() => {
                                if (formValidation()) {
                                    setModalVisible(true);
                                }
                            }}>
                                <Text style={[styles.buttonText]}>Confirm</Text>
                            </TouchableOpacity>
                        </View>
                        :
                        <TouchableOpacity style={[styles.buttonView, { width: '100%', backgroundColor: stage == APPOINTMENT_CANCELLED ? 'lightgray' : GlobalColors.blue }]}
                            onPress={() => {
                                if (APPOINTMENT_CREATED == stage) {
                                    formValidation() ? setModalVisible(true) : null;
                                } else if (APPOINTMENT_CONFIRMED == stage) {
                                    setModalVisible(true);
                                }
                                else {
                                    Toast.show("For Bill Generation, use Web instead");
                                }
                            }}
                            disabled={stage == APPOINTMENT_CANCELLED}
                        >
                            <Text style={styles.buttonText}>{isCreate ? "Create" : stage == APPOINTMENT_CONFIRMED ? "Check In" : stage == APPOINTMENT_CHECKIN ? "Generate Bill" : "Cancelled"}</Text>
                        </TouchableOpacity>
                }
            </View>
            {modalVisible &&
                <AlertModal modalVisible={modalVisible} setModalVisible={setModalVisible}
                    description={`Are you sure, you want to \n ${isCreate ? "create & confirm an appointment" : isUpdate ? "update appointment" : stage == APPOINTMENT_ONLINE ? "confirm appointment" : "mark appointment as Checked In"}`}
                    heading={isCreate ? "Create & Confirm \n Appointment" : isUpdate ? "Update Appointment" : stage == APPOINTMENT_ONLINE ? "Confirm Appointment" : "Checked In \n Appointment"}
                    onConfirm={() => {
                        appointmentAPICall((isCreate || stage == APPOINTMENT_ONLINE) ? APPOINTMENT_CONFIRMED : isUpdate ? APPOINTMENT_UPDATED : APPOINTMENT_CHECKIN);
                    }} />}
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
    buttonView: {
        backgroundColor: GlobalColors.blue,
        paddingVertical: 10,
        borderRadius: 5,
    },
    buttonText: {
        color: "#fff",
        textAlign: "center",
        fontSize: FontSize.large,
        fontWeight: '500'
    },
    spaceBtView: { justifyContent: 'space-between', width: '100%', marginBottom: 20 },
    onlineAppButton: { width: '45%', paddingVertical: 10, borderRadius: 5, borderWidth: 1, borderColor: GlobalColors.blue }
});

export default CreateEditAppointment;