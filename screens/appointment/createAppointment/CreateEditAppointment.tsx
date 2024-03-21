import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { FontSize, GlobalColors } from "../../../Styles/GlobalStyleConfigs";
import { useAppDispatch, useAppSelector } from "../../../redux/Hooks";
import { setShowUserProfileTopBar } from "../../../redux/state/UIStates";
import { GlobalStyles } from "../../../Styles/Styles";
import { environment } from "../../../utils/Constants";
import { selectBranchId, selectProductServiceCategories, selectTenantId } from "../../../redux/state/UserStates";
import { makeAPIRequest } from "../../../utils/Helper";
import Toast from "react-native-root-toast";
import GuestExpertDropdown from "./GuestExpertDropdown";
import { useCustomerData } from "../../../customHooks/AppointmentHooks";
import { ServiceDetailsType } from "../../../utils/Types";
import { selectSelectedGuest, setSelectedGuest } from "../../../redux/state/AppointmentStates";
import Header from "./Header";
import { TimerWithBorderHeader } from "../../../components/HeaderTextField";
import ServiceSearchModal from "./ServiceSearchModal";
import FooterActionButtons from "./FooterActionButtons";
import AddUpdateUser from "../../commonScreens/common/AddUpdateUser";
import { getGuestDetails } from "../../../utils/Appointment";

const CreateEditAppointment = ({ navigation, route }: any) => {

    const isCreate = route.params.isCreate;
    const appointmentDetails = route.params.appointment;
    const stage = route.params.stage;

    const dispatch = useAppDispatch();
    const storeId = useAppSelector(selectBranchId);
    const tenantId = useAppSelector(selectTenantId);
    const guestDetails = useAppSelector(selectSelectedGuest) ?? null;
    const services = useAppSelector(selectProductServiceCategories);

    const [selectedCustomer, setSelectedCustomer] = useState<{ [key: string]: any } | null>(null);
    const [instructions, setInstructions] = useState<string>('');
    const [createUserModal, setCreateUserModal] = useState<boolean>(false);
    const customers = useCustomerData(createUserModal);
    const [serviceDetails, setServiceDetails] = useState<ServiceDetailsType[]>([]);

    const addEmptyService = () => {
        let lastObj = serviceDetails[serviceDetails.length - 1];
        let errorMsg = lastObj.service && Object.keys(lastObj.service).length == 0 ? "Select Service" : (lastObj.experts.length == 0 ? "Select Expert" : (!lastObj.fromTime ? "Select From Time" : (!lastObj.toTime ? "Select To Time" : null)));
        if (errorMsg) {
            Toast.show(errorMsg, { backgroundColor: GlobalColors.error, duration: Toast.durations.LONG });
            return;
        }
        setServiceDetails([...serviceDetails, { service: {}, experts: [{}], fromTime: "", toTime: "" }]);
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
            getGuestDetails(appointmentDetails.guestId, tenantId!, storeId!, dispatch);
            setUpdateData();
        }
    }, []);

    //only used for create
    useEffect(() => {
        if (isCreate && selectedCustomer) {
            Object.keys(selectedCustomer).length > 0 ? getGuestDetails(selectedCustomer!.id, tenantId!, storeId!, dispatch) : dispatch(setSelectedGuest({ selectedGuest: {} }));
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
            <FooterActionButtons serviceDetails={serviceDetails} selectedDate={route.params.selectedDate} appointmentDetails={appointmentDetails} instructions={instructions}
                stage={stage} isCreate={isCreate} navigation={navigation} selectedCustomer={selectedCustomer} formValidation={formValidation} setSelectedCustomer={setSelectedCustomer}
            />
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

export default CreateEditAppointment;