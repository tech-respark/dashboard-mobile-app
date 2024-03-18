import React, { FC, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { FontSize, GlobalColors } from "../../Styles/GlobalStyleConfigs";
import { Ionicons } from "@expo/vector-icons";
import { ScrollView } from "react-native-gesture-handler";
import moment from "moment";
import AlertModal from "../../components/AlertModal";
import { environment } from "../../utils/Constants";
import { makeAPIRequest } from "../../utils/Helper";
import Toast from "react-native-root-toast";

interface IAppointmentsCardView {
    selectedView: string,
    appointments: { [key: string]: any }[],
    reFetchData: () => void,
}
const AppointmentsCardView: FC<IAppointmentsCardView> = ({ selectedView, appointments, reFetchData }) => {
    const [modalVisible, setModalVisible] = useState<boolean>(false);

    const deleteAppointment = async(id: string) => {
        console.log(id)
        const url = environment.txnUrl + `appointment/${id}`;
        let response = await makeAPIRequest(url, null, "DELETE");
        if(response && response.code == 200){
            Toast.show("Appointment deleted sucessfully", {backgroundColor: GlobalColors.success});
            reFetchData();
        }else{
            Toast.show("Encountered Error", {backgroundColor: GlobalColors.error});
        }
    };

    return (
        appointments.length > 0 ?
            <ScrollView style={styles.mainView}>
                {
                    appointments.map((appointment, index) => (
                        <View key={index} style={{ width: '100%', elevation: 2, borderRadius: 5, backgroundColor: '#fff', shadowColor: "black", shadowOffset: { width: 0, height: 0.2 }, shadowOpacity: 0.5, shadowRadius: 1, paddingVertical: 15, marginVertical: 8 }}>
                            {modalVisible && <AlertModal modalVisible={modalVisible} setModalVisible={setModalVisible} heading="Delete Appointment" description={`Are you sure, you want to delete this appointment of ${appointment.guestName}`} onConfirm={()=>{deleteAppointment(appointment.id)}}/>}
                            {selectedView == "completed" || appointment.status.slice(-1)[0]['status'].toLowerCase() == "completed" ?
                                <>
                                    <View style={[styles.justifiedRow, { paddingRight: 15 }]}>
                                        <View style={{ width: 5, backgroundColor: 'red', height: '95%', borderTopRightRadius: 5, borderBottomRightRadius: 5 }} />
                                        <View style={[styles.justifiedRow, { width: '96%' }]}>
                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                <Text style={{ fontSize: FontSize.large, color: 'red', marginRight: 5 }}>#</Text>
                                                <Text style={{ fontSize: FontSize.medium }}>{appointment.invoiceId}</Text>
                                            </View>
                                            <TouchableOpacity style={{ padding: 6, backgroundColor: '#e8f3fc', borderRadius: 20 }}
                                                onPress={()=>{setModalVisible(true)}}>
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
                                    <View style={{ width: 5, backgroundColor: 'red', height: '95%', borderTopRightRadius: 5, borderBottomRightRadius: 5 }} />
                                    <View style={[styles.justifiedRow, { width: '96%' }]}>
                                        <View>
                                            <Text style={{ fontSize: FontSize.medium }}>{appointment.guestName}</Text>
                                            <Text>{appointment.guestMobile}</Text>
                                        </View>
                                        <TouchableOpacity style={{ padding: 6, backgroundColor: '#e8f3fc', borderRadius: 20 }}
                                                onPress={()=>{setModalVisible(true)}}>
                                                <Ionicons name="trash-outline" color='red' size={25} />
                                            </TouchableOpacity>
                                    </View>
                                </View>

                            }
                            <View style={[styles.justifiedRow, { marginTop: 20, marginBottom: 10, paddingHorizontal: 15 }]}>
                                <View style={{width: '80%'}}>
                                    {
                                        appointment.expertAppointments.map((expertAppointment: { [key: string]: any}, eIndex: number ) => (
                                            <Text key={eIndex} style={{ fontWeight: '300' }}>{expertAppointment.service}</Text>
                                        ))
                                    }
                                </View>
                                <View style={{ flexDirection: "row" }}>
                                    <Text style={{ color: GlobalColors.blue, paddingHorizontal: 3 }}>Qty</Text>
                                    {/* todo static qty */}
                                    <Text>1</Text>
                                </View>
                            </View>
                            <View style={[styles.justifiedRow, { paddingHorizontal: 15 }]}>
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={{ marginRight: 10 }}>{moment(appointment.appointmentDay).format('DD/MM/YYYY')}</Text>
                                    <Text>{moment(appointment.appointmentTime, 'HH:mm').format('h:mm A')}</Text>
                                </View>
                                <Text>POS</Text>
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
    mainView: { flex: 1, backgroundColor: GlobalColors.lightGray2, width: '100%', paddingHorizontal: 10, paddingVertical: 8 }
});

export default AppointmentsCardView;