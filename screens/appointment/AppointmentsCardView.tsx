import React, { FC } from "react";
import { StyleSheet, Text, View } from "react-native";
import { FontSize, GlobalColors } from "../../Styles/GlobalStyleConfigs";
import { Ionicons } from "@expo/vector-icons";
import { ScrollView } from "react-native-gesture-handler";
import moment from "moment";

interface IAppointmentsCardView {
    selectedView: string,
    appointments: { [key: string]: any }[];
}
const AppointmentsCardView: FC<IAppointmentsCardView> = ({ selectedView, appointments }) => {
    return (
        appointments.length > 0 ?
            <ScrollView style={styles.mainView}>
                {
                    appointments.map((appointment, index) => (
                        <View key={index} style={{ width: '100%', elevation: 2, borderRadius: 5, backgroundColor: '#fff', shadowColor: "black", shadowOffset: { width: 0, height: 0.2 }, shadowOpacity: 0.5, shadowRadius: 1, paddingVertical: 15, marginVertical: 8 }}>
                            {selectedView == "completed" || appointment.status.slice(-1)[0]['status'].toLowerCase() == "completed" ?
                                <>
                                    <View style={[styles.justifiedRow, { paddingRight: 15 }]}>
                                        <View style={{ width: 5, backgroundColor: 'red', height: '95%', borderTopRightRadius: 5, borderBottomRightRadius: 5 }} />
                                        <View style={[styles.justifiedRow, { width: '96%' }]}>
                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                <Text style={{ fontSize: FontSize.large, color: 'red', marginRight: 5 }}>#</Text>
                                                <Text style={{ fontSize: FontSize.medium }}>{appointment.invoiceId}</Text>
                                            </View>
                                            <View style={{ padding: 6, backgroundColor: '#e8f3fc', borderRadius: 20 }}>
                                                <Ionicons name="trash-outline" color='red' size={25} />
                                            </View>
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
                                        <View style={{ padding: 6, backgroundColor: '#e8f3fc', borderRadius: 20 }}>
                                            <Ionicons name="trash-outline" color='red' size={25} />
                                        </View>
                                    </View>
                                </View>

                            }
                            <View style={[styles.justifiedRow, { marginTop: 20, marginBottom: 10, paddingHorizontal: 15 }]}>
                                <View>
                                    {
                                        appointment.expertAppointments.map((expertAppointment: { [key: string]: any }) => (
                                            <Text key={expertAppointment.id} style={{ fontWeight: '300' }}>{expertAppointment.service}</Text>
                                        ))
                                    }
                                </View>
                                <View style={{ flexDirection: "row" }}>
                                    <Text style={{ color: GlobalColors.blue, paddingHorizontal: 3 }}>Qty</Text>
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