import React, { FC, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { FontSize, GlobalColors } from "../../../Styles/GlobalStyleConfigs";
import { GlobalStyles } from "../../../Styles/Styles";
import { APPOINTMENT_CANCELLED, APPOINTMENT_CHECKIN, APPOINTMENT_CONFIRMED, APPOINTMENT_CREATED, APPOINTMENT_ONLINE, APPOINTMENT_UPDATED, DEFAULT_SERVICE_DURATION, environment } from "../../../utils/Constants";
import Toast from "react-native-root-toast";
import MembershipValidationModal from "./MembershipValidationModal";
import CancelAppointmentButton from "./CancelAppointmentButton";
import AlertModal from "../../../components/AlertModal";
import CheckboxWithTitle from "../../../components/CheckboxWithTitle";
import { useAppDispatch, useAppSelector } from "../../../redux/Hooks";
import { setIsLoading } from "../../../redux/state/UIStates";
import { selectBranchId, selectCurrentStoreConfig, selectSMSConfig, selectTenantId, selectUserData } from "../../../redux/state/UserStates";
import { calculateTaxes } from "../../../utils/Appointment";
import { ServiceDetailsType } from "../../../utils/Types";
import moment from "moment";
import { selectSelectedGuest } from "../../../redux/state/AppointmentStates";
import { makeAPIRequest } from "../../../utils/Helper";

interface IFooterActionButtons {
    serviceDetails: ServiceDetailsType[],
    selectedDate: string,
    appointmentDetails: { [key: string]: any } | null,
    instructions: string,
    stage: string,
    isCreate: boolean,
    navigation: any
    selectedCustomer: { [key: string]: any } | null,
    formValidation: () => boolean,
    setSelectedCustomer: (val: { [key: string]: any }) => void,
}

const FooterActionButtons: FC<IFooterActionButtons> = ({ serviceDetails, selectedDate, appointmentDetails, instructions, stage, isCreate, navigation, selectedCustomer, formValidation, setSelectedCustomer }) => {
    const dispatch = useAppDispatch();
    const storeConfig = useAppSelector(selectCurrentStoreConfig);
    const loggedInUser = useAppSelector(selectUserData);
    const smsConfig = useAppSelector(selectSMSConfig);
    const storeId = useAppSelector(selectBranchId);
    const tenantId = useAppSelector(selectTenantId);
    const guestDetails = useAppSelector(selectSelectedGuest) ?? null;

    const [isUpdate, setIsUpdate] = useState<boolean>(false);
    const [enableSMS, setEnableSMS] = useState<boolean>(smsConfig!.appointmentConfirmed ?? false);
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [membershipValidationModal, setMembershipValidationModal] = useState<boolean>(false);

    const getSMSKeys = () => {
        return {
            appointmentCancelled: smsConfig!.appointmentCancelled,
            appointmentConfirmed: enableSMS, //for creating confirmation sms
            combineFeedbackAndInvoice: smsConfig!.combineFeedbackAndInvoice,
            smsForAppointments: smsConfig!.smsForAppointments,
        }
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

    const createAppointmentPayload = (actionType: string) => {
        let appointmentsList: any = [];
        serviceDetails.map((service: any) => {
            appointmentsList.push(createIndividualExpertService(service));
        });
        const appointmentObj: any = {
            //some new keys are there to be added later
            "appointmentDay": appointmentDetails?.appointmentDay ?? moment(selectedDate, 'YYYY-MM-DD').toISOString(),
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

    return (
        <>
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
                            <CancelAppointmentButton cancelSMSDefault={smsConfig!.appointmentCancelled} appointmentDetails={appointmentDetails!} navigation={navigation} />
                        </View>
                }
                {
                    stage == APPOINTMENT_ONLINE ?
                        <View style={[GlobalStyles.justifiedRow, { width: '100%' }]}>
                            <CancelAppointmentButton cancelSMSDefault={smsConfig!.appointmentCancelled} appointmentDetails={appointmentDetails!} navigation={navigation} />
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
        </>
    );
};

const styles = StyleSheet.create({
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
    spaceBtView: {
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 20
    },
    onlineAppButton: {
        width: '45%',
        paddingVertical: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: GlobalColors.blue
    }
});

export default FooterActionButtons;