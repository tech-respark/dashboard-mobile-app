import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { FontSize, GlobalColors } from "../../../Styles/GlobalStyleConfigs";
import { useIsFocused } from "@react-navigation/native";
import { useAppDispatch, useAppSelector } from "../../../redux/Hooks";
import { setIsLoading, setShowUserProfileTopBar } from "../../../redux/state/UIStates";
import { GlobalStyles } from "../../../Styles/Styles";
import { APPOINTMENT_CREATED, DEFAULT_SERVICE_DURATION, environment } from "../../../utils/Constants";
import { selectBranchId, selectCurrentStoreConfig, selectProductServiceCategories, selectTenantId, selectUserData } from "../../../redux/state/UserStates";
import { makeAPIRequest } from "../../../utils/Helper";
import Toast from "react-native-root-toast";
import { TimerWithBorderHeader } from "../../../components/HeaderTextField";
import ServiceSearchModal from "./ServiceSearchModal";
import Checkbox from 'expo-checkbox';
import AddUpdateUser from "../common/AddUpdateUser";
import GuestExpertDropdown from "./GuestExpertDropdown";
import { useCustomerData } from "../../../customHooks/AppointmentHooks";
import { ServiceDetailsType } from "../../../utils/Types";
import { calculateTaxes } from "../../../utils/Appointment";
import moment from "moment";
import ConfirmationModal from "./ConfirmationModal";
import { selectSelectedGuest, setSelectedGuest } from "../../../redux/state/AppointmentStates";
import MembershipValidationModal from "./MembershipValidationModal";


const CreateAppointment = ({ navigation, route }: any) => {

    const dispatch = useAppDispatch();
    const storeId = useAppSelector(selectBranchId);
    const tenantId = useAppSelector(selectTenantId);
    const services = useAppSelector(selectProductServiceCategories);
    const storeConfig = useAppSelector(selectCurrentStoreConfig);
    const loggedInUser = useAppSelector(selectUserData);
    const guestDetails = useAppSelector(selectSelectedGuest) ?? null;

    const [selectedCustomer, setSelectedCustomer] = useState<{ [key: string]: any } | null>(null);
    const [instructions, setInstructions] = useState<string>('');
    const [enableSMS, setEnableSMS] = useState<boolean>(true);
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [membershipValidationModal, setMembershipValidationModal] = useState<boolean>(false);
    const [createUserModal, setCreateUserModal] = useState<boolean>(false);
    const customers = useCustomerData(createUserModal);
    const [serviceDetails, setServiceDetails] = useState<ServiceDetailsType[]>([{
        service: null,
        experts: [route.params.staffObjects[route.params.selectedStaffIndex]],
        fromTime: route.params.from,
        toTime: route.params.to
    }]);

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
        serviceObj.experts.length>0 && serviceObj.experts.map((contributor: any, index: number) => {
            contributions.push({
                slot: `${serviceObj.fromTime}-${serviceObj.toTime}`,
                duration: duration || DEFAULT_SERVICE_DURATION,
                expertId: contributor.id,
                expertName: contributor.name,
                workPercentage: (100 / serviceObj.experts.length).toFixed(2),
                workAmount: serviceObj.service.salePrice || serviceObj.service.price,
                specialist: index == 0 ? true : false
            })
        });
        return contributions;
    };

    const formValidation = () => {
        console.log(guestDetails, selectedCustomer)
        if (!selectedCustomer || !guestDetails) {
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
            "service": serviceObj.service.name || serviceObj.service.service || serviceObj.serviceQuery,
            "slot": `${serviceObj.fromTime}-${serviceObj.toTime}`,
            "expertId": serviceObj.experts[0].id,
            "expertName": serviceObj.experts[0].name,
            "price": serviceObj.service.price,
            "salePrice": serviceObj.service.salePrice,
            "billingPrice": serviceObj.service.salePrice || serviceObj.service.price,
            "quantity": 1,
            "serviceCategoryId": serviceObj.service.serviceCategory,
            "serviceId": serviceObj.service.id,
            "txchrgs": taxes,
            "variations": serviceObj.service.variations,
            "consumables": serviceObj.service.consumables,
            "contributions": calculateContributions(serviceObj, duration)
        }
        return individualAppointmentObj;
    };

    const getAppointmentStatus = (actionType: string) => {
        const statusList = []; //update for updation
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
            appointmentCancelled: true,
            appointmentConfirmed:false,
            combineFeedbackAndInvoice: true,
            smsForAppointments: true
        }
    };

    const createAppointmentPayload = (actionType: string) => {
        let appointmentsList: any = [];
        serviceDetails.map((service: any) => {
            appointmentsList.push(createIndividualExpertService(service));
        })
        const selectedDate = moment(route.params.selectedDate, 'YYYY-MM-DD').toISOString();
        const appointmentObj: any = {
            "appointmentDay": selectedDate,
            "appointmentTime": appointmentsList[0].appointmentTime,
            "duration": appointmentsList[0].duration,
            "instruction": instructions,
            "instrImages": [], //what is use of this
            "slot": appointmentsList[0].slot,
            "orderId": '', //maybe for update
            "invoiceId": '', //maybe for update
            "expertId": appointmentsList[0].expertId,
            "expertName": appointmentsList[0].expertName,
            "storeId": storeId,
            "tenantId": tenantId,
            "store": storeConfig!.store,
            "tenant": storeConfig!.tenant,
            "guestId": guestDetails!.id,
            "guestName": guestDetails!.lastName ? `${guestDetails!.firstName} ${guestDetails!.lastName}` : guestDetails!.firstName,
            "guestMobile": guestDetails!.mobileNo,
            "guestEmail": guestDetails!.email,
            "guestGSTN": guestDetails!.gstN,
            "bookedFor": guestDetails!.bookedFor || null,
            "storeLocation": '', //maybe for update
            "createdOn": new Date().toISOString(), //maybe for update,
            "expertAppointments": appointmentsList,
            "noOfRemindersSent": 0, //maybe for update
            "rescheduled": false, //maybe for update
            "feedbackLinkShared": false, //maybe for update
            "type": "POS",
            "smsKeys": getSMSKeys(),
            "status": getAppointmentStatus(actionType)
        };
        return appointmentObj;
    };

    const appointmentAPICall =  async(actionType: string) => {
        dispatch(setIsLoading({isLoading: true}));
        const url = environment.txnUrl + `appointments`;
        const payload = createAppointmentPayload(actionType);
        let response = await makeAPIRequest(url, payload, "POST");
        dispatch(setIsLoading({isLoading: false}));
        setModalVisible(false);
        if(response){
            Toast.show(`Appointment created successfuly`, {backgroundColor: GlobalColors.success, opacity: 1.0});
            navigation.goBack();
        }else{
            Toast.show("Encountered Error", {backgroundColor: GlobalColors.error, opacity: 1.0});
        }
    };

    const getGuestDetails = async () => {
        const url = environment.guestUrl + `customers/userbyguestid?tenantId=${tenantId}&storeId=${storeId}&guestId=${selectedCustomer!.id}`;
        let response = await makeAPIRequest(url, null, "GET");
        if (response) {
            dispatch(setSelectedGuest ({selectedGuest: response}));
        } else {
            dispatch(setSelectedGuest ({selectedGuest: {}}));
            Toast.show("Encountered issue", { backgroundColor: GlobalColors.error });
        }
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

    useEffect(()=>{
        if(selectedCustomer){
            Object.keys(selectedCustomer).length > 0 ? getGuestDetails() : dispatch(setSelectedGuest ({selectedGuest: {}}));
        }
    }, [selectedCustomer]);

    return (
        <View style={{ flex: 1 }}>
            {createUserModal && <AddUpdateUser setModalVisible={setCreateUserModal} modalVisible={createUserModal} />}
            <ScrollView style={styles.container}>
                <View style={[GlobalStyles.sectionView]}>
                    <View style={[GlobalStyles.justifiedRow, { marginBottom: 10 }]}>
                        <Text style={styles.headingText}>1. Guest Details</Text>
                        {
                            selectedCustomer && guestDetails ?
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
                    <GuestExpertDropdown data={customers} placeholderText="Search By Name Or Number" type="guest" setSelected={(val) => { setSelectedCustomer(val); setSelectedCustomer(val); }} selectedValue={selectedCustomer ? selectedCustomer.firstName : null} />
                </View>

                <View style={[GlobalStyles.sectionView]}>
                    <View style={[GlobalStyles.justifiedRow, { marginBottom: 10 }]}>
                        <Text style={styles.headingText}>2. Service Details</Text>
                        <View style={GlobalStyles.justifiedRow}>
                            <Text style={{ color: GlobalColors.blue, marginRight: 10 }}>Add Service</Text>
                            <TouchableOpacity style={styles.circleIcon}
                                onPress={()=>{
                                    if(formValidation())
                                        addEmptyService();
                                    }}>
                                <Ionicons name="add" size={25} color="#fff" />
                            </TouchableOpacity>
                        </View>
                    </View>
                    {
                        serviceDetails.map((serviceDetailsObj: ServiceDetailsType, sIndex: number) => (
                            <View style={[{ borderWidth: 1, borderRadius: 5, borderColor: 'lightgray', padding: 10, marginVertical: 8 }, GlobalStyles.shadow]} key={sIndex}>
                                {serviceDetails.length > 1 && 
                                    <View style={{flexDirection: 'row', justifyContent: 'flex-end', width: '100%'}}>
                                        <TouchableOpacity style={{backgroundColor: GlobalColors.lightGray2, padding: 3, borderRadius: 20}} 
                                        onPress={() => {
                                            setServiceDetails(prev => {
                                                const updated = [...prev];
                                                updated.splice(sIndex, 1);
                                                return updated
                                            })
                                        }}>
                                            <Ionicons name="trash-outline" color={GlobalColors.error} size={20}/>
                                        </TouchableOpacity>
                                    </View>
                                }
                                
                                <ServiceSearchModal data={services!} headerText={`Service ${sIndex + 1}`} selectedValue={serviceDetailsObj.service?.name}
                                    setSelectedValue={(val) => {
                                        setServiceDetails(prev => {
                                            const updated = [...prev];
                                            updated[sIndex].service = val;
                                            return updated
                                        })
                                    }}
                                />
                                {serviceDetailsObj.experts.map((expert: { [key: string]: any }, eIndex: number) => (
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
                                                            console.log(eIndex)
                                                            updated[sIndex].experts.splice(eIndex, 1); //bug here
                                                            return updated
                                                        })
                                                    }} />
                                            </TouchableOpacity>
                                        }
                                    </View>
                                ))
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
                    {!selectedCustomer && <Text onPress={() => { setMembershipValidationModal(true)}} style={{ color: GlobalColors.blue, textDecorationLine: 'underline' }}>Membership Validation</Text>}
                    {membershipValidationModal && <MembershipValidationModal modalVisible={membershipValidationModal} setModalVisible={setMembershipValidationModal} setCustomer={(val)=>{setSelectedCustomer(val)}}/>}
                </View>
                <TouchableOpacity style={{ width: '100%', backgroundColor: GlobalColors.blue, paddingVertical: 10, borderRadius: 5, marginBottom: 5 }}
                    onPress={() => {
                        if(formValidation())
                            setModalVisible(true);
                    }}
                >
                    <Text style={{ color: "#fff", textAlign: "center", fontSize: FontSize.large, fontWeight: '500' }}>Create</Text>
                </TouchableOpacity>
            </View>
            {modalVisible && <ConfirmationModal modalVisible={modalVisible} setModalVisible={setModalVisible} performAction={() => {
                appointmentAPICall(APPOINTMENT_CREATED);
                }}/>}
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
});

export default CreateAppointment;