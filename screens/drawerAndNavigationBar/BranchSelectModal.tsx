import React, { FC } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { FontSize, GlobalColors } from "../../Styles/GlobalStyleConfigs";
import { useAppDispatch, useAppSelector } from "../../redux/Hooks";
import { selectCurrentBranch, selectStoreData, setCurrentBranch } from "../../redux/state/UserStates";
import Toast from "react-native-root-toast";
import { GlobalStyles } from "../../Styles/Styles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

type BranchSelectModalProp = {
    showBranchModal: boolean;
    setShowBranchModal: (val: boolean) => void;
}

const BranchSelectModal: FC<BranchSelectModalProp> = ({ showBranchModal, setShowBranchModal }) => {
    const dispatch = useAppDispatch();
    const branchesData = useAppSelector(selectStoreData);
    const currentBranch = useAppSelector(selectCurrentBranch);

    return (
        <Modal
            transparent={true}
            visible={showBranchModal}
            onRequestClose={() => {
                setShowBranchModal(!showBranchModal);
            }}>
            <View style={GlobalStyles.modalbackground}>
                <View style={styles.modalView}>
                    <TouchableOpacity style={{backgroundColor: GlobalColors.lightGray2, borderRadius: 20, padding: 2, alignSelf: 'flex-end'}}
                    onPress={()=>{setShowBranchModal(false)}}>
                        <Ionicons name="close" color={GlobalColors.error} size={20} />
                    </TouchableOpacity>
                    <View style={{width: '80%', marginBottom: 20}}>
                    {branchesData?.map((branch: { [key: string]: any }, index: number) => (
                        <TouchableOpacity key={index} style={[{ paddingVertical: 15, width: '100%', alignItems: 'center' }, index != branchesData!.length - 1 ? { borderBottomWidth: 0.5, borderColor: 'lightgray' } : {}]}
                            onPress={async() => {
                                if(currentBranch != branch.name){
                                    await AsyncStorage.setItem("selectedBranchName", branch.name);
                                    dispatch(setCurrentBranch({ currentBranch: branch.name }));
                                    Toast.show(`Switched to ${branch.name}`, { backgroundColor: GlobalColors.success });
                                }
                                setShowBranchModal(false);
                            }}
                        >
                            <Text style={[{ fontSize: FontSize.heading, textTransform: 'capitalize' }, currentBranch == branch.name ? {} : { color: "lightgray" }]}>{branch.name}</Text>
                        </TouchableOpacity>
                    ))}
                    </View>
                    
                </View>
            </View>
        </Modal>
    )
};

const styles = StyleSheet.create({
    modalView: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 10,
        width: '75%',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
});

export default BranchSelectModal;