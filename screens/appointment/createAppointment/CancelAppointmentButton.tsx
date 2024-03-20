import React, { FC, useState } from "react";
import { Text, TouchableOpacity } from "react-native";
import { FontSize, GlobalColors } from "../../../Styles/GlobalStyleConfigs";
import AlertModal from "../../../components/AlertModal";
import { useAppDispatch, useAppSelector } from "../../../redux/Hooks";
import { setIsLoading } from "../../../redux/state/UIStates";
import { APPOINTMENT_CANCELLED, environment } from "../../../utils/Constants";
import { makeAPIRequest } from "../../../utils/Helper";
import Toast from "react-native-root-toast";
import { selectUserData } from "../../../redux/state/UserStates";

interface ICancelAppointmentButton {
    navigation: any,
    cancelSMSDefault: boolean,
    appointmentDetails: {[key: string]: any},
}

const CancelAppointmentButton: FC<ICancelAppointmentButton> = ({cancelSMSDefault, appointmentDetails, navigation}) => {
    const dispatch = useAppDispatch();
    const loggedInUser = useAppSelector(selectUserData);

    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [enableCancelSMS, setEnableCancelSMS] = useState<boolean>(cancelSMSDefault);
    
    const markAppointmentCancelled = async() => {
        dispatch(setIsLoading({ isLoading: true }));
        const url = environment.txnUrl + `appointments`;
        let payload = {...appointmentDetails };
        payload["status"].push({
            staff: loggedInUser!.id,
            createdOn: new Date().toISOString(),
            status: APPOINTMENT_CANCELLED
        });
        payload.smsKeys['appointmentCancelled'] = enableCancelSMS;
        let response = await makeAPIRequest(url, payload, "POST");
        dispatch(setIsLoading({ isLoading: false }));
        if (response) {
            Toast.show(`Appointment cancelled successfuly`, { backgroundColor: GlobalColors.success, opacity: 1.0 });
            navigation.goBack();
        } else {
            Toast.show("Encountered Error", { backgroundColor: GlobalColors.error, opacity: 1.0 });
        }
    };

    return (
        <>
            <TouchableOpacity style={[{ width: '45%', paddingVertical: 10, borderRadius: 5, borderWidth: 1, borderColor: GlobalColors.blue }]}
                onPress={() => { setModalVisible(true) }}>
                <Text style={{ color: GlobalColors.blue, textAlign: "center", fontSize: FontSize.large, fontWeight: '500' }}>Cancel</Text>
            </TouchableOpacity>
            <AlertModal modalVisible={modalVisible} setModalVisible={setModalVisible} heading="Cancel Appointment" description="Are you sure, you want to mark appointment as cancelled" onConfirm={async() => {markAppointmentCancelled()}}
                checkBoxDescription="Send appointment Cancel SMS" checkBox={enableCancelSMS} setCheckBox={setEnableCancelSMS}
            />
        </>
    );
};

export default CancelAppointmentButton;