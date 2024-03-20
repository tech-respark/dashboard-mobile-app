import React, { FC, useLayoutEffect, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GlobalColors } from '../../../Styles/GlobalStyleConfigs';
import AlertModal from '../../../components/AlertModal';
import { APPOINTMENT_ONLINE, environment } from '../../../utils/Constants';
import { makeAPIRequest } from '../../../utils/Helper';
import Toast from 'react-native-root-toast';
import { useAppDispatch } from '../../../redux/Hooks';
import { setIsLoading } from '../../../redux/state/UIStates';

interface IHeader {
    isCreate: boolean, 
    navigation: any,
    guestName: string,
    appointmentId: string,
    stage: string
}

const Header: FC<IHeader> = ({ isCreate, navigation, guestName, appointmentId, stage }) => {
    const dispatch = useAppDispatch();
    const [deleteModal, setDeleteModal] = useState<boolean>(false);

    const deleteAppointment = async() => {
        dispatch(setIsLoading({ isLoading: true }));
        const url = environment.txnUrl + `appointment/${appointmentId}`;
        let response = await makeAPIRequest(url, null, "DELETE");
        dispatch(setIsLoading({ isLoading: false }));
        if(response && response.code == 200){
            Toast.show(`Appointment deleted successfuly`, { backgroundColor: GlobalColors.success, opacity: 1.0 });
            navigation.goBack();
        } else {
            Toast.show("Encountered Error", { backgroundColor: GlobalColors.error, opacity: 1.0 });
        }
    };

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: `${isCreate ? "Create" : stage==APPOINTMENT_ONLINE ? "Confirm": "Update"} Appointment`,
            headerTitleAlign: 'left',
            headerLeft: () => (
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name={"chevron-back-outline"} size={20} style={{ marginHorizontal: 5, color: GlobalColors.blue }} />
                </TouchableOpacity>
            ),
            headerRight: isCreate ? null : () => (
                <TouchableOpacity
                    onPress={() => {setDeleteModal(true)}}
                    style={{ backgroundColor: GlobalColors.lightGray2, borderRadius: 20, marginRight: 10, padding: 2 }}
                >
                    <Ionicons
                        name="trash-outline"
                        size={25}
                        color={GlobalColors.error}
                    />
                </TouchableOpacity>
            ),
        });
    }, [navigation, isCreate]);

    return isCreate ? null :
        (<>
            {deleteModal && <AlertModal modalVisible={deleteModal} setModalVisible={setDeleteModal} heading="Delete Appointment" description={`Are you sure, you want to delete this appointment of ${guestName}`} onConfirm={deleteAppointment} />}
        </>
        );
};

export default Header;
