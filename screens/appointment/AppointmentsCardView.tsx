import React, { FC, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { FontSize, GlobalColors } from "../../Styles/GlobalStyleConfigs";
import { Ionicons } from "@expo/vector-icons";
import { ScrollView } from "react-native-gesture-handler";
import moment from "moment";
import AlertModal from "../../components/AlertModal";
import { APPOINTMENT_COMPLETED, APPOINTMENT_ONLINE, environment } from "../../utils/Constants";
import { makeAPIRequest } from "../../utils/Helper";
import Toast from "react-native-root-toast";
import { GlobalStyles } from "../../Styles/Styles";
import { useAppDispatch } from "../../redux/Hooks";
import { setShowUserProfileTopBar } from "../../redux/state/UIStates";

interface IAppointmentsCardView {
    selectedView: string,
    appointments: { [key: string]: any }[],
    reFetchData: () => void,
    navigation: any,
    staffObjects: { [key: string]: any }[],
}
const AppointmentsCardView: FC<IAppointmentsCardView> = ({ selectedView, appointments, reFetchData, navigation, staffObjects }) => {
    const dispatch = useAppDispatch();
    const [modalVisible, setModalVisible] = useState<boolean>(false);

    const deleteAppointment = async (id: string) => {
        const url = environment.txnUrl + `appointment/${id}`;
        let response = await makeAPIRequest(url, null, "DELETE");
        if (response && response.code == 200) {
            Toast.show("Appointment deleted sucessfully", { backgroundColor: GlobalColors.success });
            reFetchData();
        } else {
            Toast.show("Encountered Error", { backgroundColor: GlobalColors.error });
        }
    };

    return (
        appointments?.length > 0 ?
            <ScrollView style={styles.mainView}>
                {
                    appointments.map((appointment, index) => (
                        <View key={index} style={[GlobalStyles.cardView, { paddingHorizontal: 0 }, GlobalStyles.shadow]}>
                            {modalVisible && <AlertModal modalVisible={modalVisible} setModalVisible={setModalVisible} heading="Delete Appointment" description={`Are you sure, you want to delete this appointment of ${appointment.guestName}`} onConfirm={() => { deleteAppointment(appointment.id) }} />}
                            {selectedView == APPOINTMENT_COMPLETED || appointment.status.slice(-1)[0]['status'] == APPOINTMENT_COMPLETED ?
                                <>
                                    <View style={[styles.justifiedRow, { paddingRight: 15 }]}>
                                        <View style={{ width: 5, backgroundColor: 'red', height: '95%', borderTopRightRadius: 5, borderBottomRightRadius: 5 }} />
                                        <View style={[styles.justifiedRow, { width: '96%' }]}>
                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                <Text style={{ fontSize: FontSize.large, color: 'red', marginRight: 5 }}>#</Text>
                                                <Text style={{ fontSize: FontSize.medium }}>{appointment.invoiceId}</Text>
                                            </View>
                                            <TouchableOpacity style={{ padding: 6, backgroundColor: '#e8f3fc', borderRadius: 20 }}
                                                onPress={() => { setModalVisible(true) }}>
                                                <Ionicons name="trash-outline" color='red' size={25} />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                    <View style={{ paddingHorizontal: 15 }}>
                                        <Text style={{ fontSize: FontSize.medium }}>{appointment.guestName}</Text>
                                        <Text>{appointment.guestMobile}</Text>
                                    </View>
                                </>
                                :
                                <View style={[styles.justifiedRow, { paddingRight: 15 }]}>
                                    <View style={styles.sideColorView} />
                                    <View style={[styles.justifiedRow, { width: '96%' }]}>
                                        <View>
                                            <Text style={{ fontSize: FontSize.medium }}>{appointment.guestName}</Text>
                                            <Text>{appointment.guestMobile}</Text>
                                        </View>
                                        <TouchableOpacity style={{ padding: 6, backgroundColor: '#e8f3fc', borderRadius: 20 }}
                                            onPress={() => { setModalVisible(true) }}>
                                            <Ionicons name="trash-outline" color='red' size={25} />
                                        </TouchableOpacity>
                                    </View>
                                </View>

                            }
                            <View style={[styles.justifiedRow, { marginTop: 20, paddingHorizontal: 15 }]}>
                                <View style={{ width: selectedView == APPOINTMENT_ONLINE ? '60%' : '80%' }}>
                                    <View style={{ marginBottom: 5 }}>
                                        {
                                            appointment.expertAppointments.map((expertAppointment: { [key: string]: any }, eIndex: number) => (
                                                <Text key={eIndex} style={{ fontWeight: '300' }}>{expertAppointment.service}</Text>
                                            ))
                                        }
                                    </View>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={{ marginRight: 10 }}>{moment(appointment.appointmentDay).format('DD/MM/YYYY')}</Text>
                                        <Text>{moment(appointment.appointmentTime, 'HH:mm').format('h:mm A')}</Text>
                                    </View>
                                </View>
                                {selectedView == APPOINTMENT_ONLINE ?
                                    <TouchableOpacity style={styles.buttonView} onPress={() => {
                                        dispatch(setShowUserProfileTopBar({ showUserProfileTopBar: false }));
                                        navigation.navigate("Create Edit Appointment", { isCreate: false, stage: APPOINTMENT_ONLINE, staffObjects: staffObjects, appointment: appointment });
                                    }}>
                                        <Text style={{ color: GlobalColors.blue, fontSize: FontSize.medium }}>Assign Expert</Text>
                                    </TouchableOpacity> :
                                    <View style={{ alignItems: 'center' }}>
                                        <View style={{ flexDirection: "row", alignItems: 'center', marginBottom: 5 }}>
                                            <Text style={{ color: GlobalColors.blue, paddingHorizontal: 3 }}>Qty</Text>
                                            <Text>1</Text>
                                        </View>
                                        <Text>{appointment.type}</Text>
                                    </View>
                                }
                            </View>
                        </View>
                    ))
                }
            </ScrollView> :
            <View style={[styles.mainView, { justifyContent: 'center', alignItems: 'center' }]}>
                <Text style={{ textTransform: 'capitalize' }}>{selectedView} Appointments Not Available</Text>
            </View>
    )
};

const styles = StyleSheet.create({
    justifiedRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    mainView: { flex: 1, backgroundColor: GlobalColors.lightGray2, width: '100%', paddingHorizontal: 10, paddingVertical: 8 },
    buttonView: { borderWidth: 1, borderColor: GlobalColors.blue, borderRadius: 3, width: '35%', alignItems: 'center', padding: 5 },
    sideColorView: { width: 5, backgroundColor: 'red', height: '95%', borderTopRightRadius: 5, borderBottomRightRadius: 5 }
});

export default AppointmentsCardView;