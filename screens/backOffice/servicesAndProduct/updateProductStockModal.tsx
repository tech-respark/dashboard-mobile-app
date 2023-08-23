import React, { FC, useEffect, useState } from "react";
import { StyleSheet, TextInput, TouchableOpacity } from "react-native";
import { Button, Modal, Text, View } from "react-native";
import { FontSize, GlobalColors, GradientButtonColor } from "../../../Styles/GlobalStyleConfigs";
import Checkbox from "expo-checkbox";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { makeAPIRequest } from "../../../utils/Helper";
import { environment } from "../../../utils/Constants";
import { useAppSelector } from "../../../redux/Hooks";
import { selectBranchId, selectTenantId } from "../../../redux/state/UserStates";
import Toast from "react-native-root-toast";

type UpdateProductStockModalProp = {
    selectedProduct: { [key: string]: any };
    topLevelObject: {[key: string]: any};
};


const UpdateProductStockModal: FC<UpdateProductStockModalProp> = ({ selectedProduct, topLevelObject }) => {
    const storeId = useAppSelector(selectBranchId);
    const tenantId = useAppSelector(selectTenantId);

    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [variationValues, setVariationValues] = useState<{[key: string]: any}>({});

    const toggleModal = () => {
        setModalVisible(!modalVisible);
    };

    const handleVariationValueChange = (variationKey: any, value: string) => {
        setVariationValues((prevValues) => ({
          ...prevValues,
          [variationKey]: value,
        }));
      };

    const updateStock = async() => {
        let requestBody = selectedProduct.variations.map((item: any) => ({
            itemId: selectedProduct.id,
            itemName: selectedProduct.name,
            storeId: storeId, 
            tenantId: tenantId,
            variationId: item.id,
            variationName: item.name,
            catLevel1Name: topLevelObject.name,
            catLevel1Id: topLevelObject.id,
            stock: variationValues[`${selectedProduct.id}${item.id}`]
          }));
        let response = await makeAPIRequest(environment.documentBaseUri+"itemstock", requestBody, "POST");
        if(response){
            Toast.show("Updated Successfully", {backgroundColor: GlobalColors.success, opacity: 1})
            toggleModal();
        }else{
            Toast.show("Encountered Error", {backgroundColor: GlobalColors.error, opacity: 1})
        }
    };
    const getProductQuantity = async () => {
        try {
          let requestBody = selectedProduct.variations.map((item: any) => ({
            itemId: selectedProduct.id,
            itemName: selectedProduct.name,
            storeId: storeId, 
            tenantId: tenantId,
            variationId: item.id,
            variationName: item.name,
          }));
          let response = await makeAPIRequest(environment.documentBaseUri + "itemstockbyitemid", requestBody, "POST");
          if (response) {
            console.log(response);
            Object.entries(response).forEach(([key, value]) => {
              handleVariationValueChange(key, String(value));
            });
          } else {
            Toast.show("Encountered Error while fetching", {backgroundColor: GlobalColors.error, opacity: 1});
          }
        } catch (error) {
          console.error("Error fetching product quantity:", error);
          Toast.show("Encountered Error while fetching", {backgroundColor: GlobalColors.error, opacity: 1});
        }
      };

    useEffect(() => {
        modalVisible ? getProductQuantity() : null;
    }, [modalVisible]);


    return (
        <>
            <Ionicons name={"add"} size={20} color={GlobalColors.blue} style={{ marginRight: 10 }}
                onPress={toggleModal} />
            <Modal
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    toggleModal();
                }}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={{ fontSize: FontSize.heading, fontWeight: '500', marginBottom: 15 }}>Update Stock</Text>
                        <Text style={{ fontSize: FontSize.heading, fontWeight: '300', textAlign: 'center', marginBottom: 20 }}>{selectedProduct.name}</Text>
                        <View style={{ paddingBottom: 15, width: '80%' }}>
                            {selectedProduct.variations.map((variation: any, index: number) => (
                                <View style={{ marginVertical: 10 }}  key={`${selectedProduct.id}${variation.id}`}>
                                    <Text style={{ fontSize: FontSize.large, fontWeight: '300' }}>{variation.name}</Text>
                                    <View style={styles.inputContainer}>
                                    <TextInput
                                        style={styles.textInput}
                                        placeholderTextColor="lightgray"
                                        underlineColorAndroid="transparent"
                                        keyboardType="number-pad"
                                        onChangeText={(val) => handleVariationValueChange(`${selectedProduct.id}${variation.id}`, val)}
                                        value={variationValues[`${selectedProduct.id}${variation.id}`] || ''}
                                    />
                                    <Text style={{color: 'gray', paddingRight: 5}}>In Stock</Text>
                                    </View>
                                </View>
                            ))}
                        </View>
                        <View style={styles.buttons}>
                            <TouchableOpacity onPress={() => {
                                setVariationValues({});
                                toggleModal();
                            }} style={styles.cancelButtom}>
                                <Text style={[styles.cancelButtonText, { color: GlobalColors.blue }]}>Cancel</Text>
                            </TouchableOpacity>
                            <LinearGradient
                                colors={GradientButtonColor}
                                style={styles.cancelButtom}
                                start={{ y: 0.0, x: 0.0 }}
                                end={{ y: 0.0, x: 1.0 }}
                            >
                                <TouchableOpacity onPress={() => {
                                    updateStock();
                                }} >
                                    <Text style={[styles.cancelButtonText, { color: '#fff' }]}>Save</Text>
                                </TouchableOpacity>
                            </LinearGradient>
                        </View>


                    </View>
                </View>

            </Modal>
        </>
    );
};


const styles = StyleSheet.create({
    cancelButtom: {
        borderWidth: 1,
        paddingVertical: 5,
        width: '40%',
        alignItems: 'center',
        borderRadius: 20,
        borderColor: GlobalColors.blue
    },
    cancelButtonText:
    {
        fontSize: FontSize.large,
        paddingHorizontal: 20
    },
    buttons: {
        flexDirection: 'row',
        marginTop: 20,
        justifyContent: 'space-evenly', width: '100%'
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        paddingVertical: 20,
        paddingHorizontal: 10,
        borderRadius: 10,
        elevation: 5,
        width: '80%'
    },
    textInput: {
        flex: 1,
        fontSize: FontSize.regular,
        color: 'black',
        paddingHorizontal: 10
      },
      inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 0.5,
        borderColor: 'lightgray',
        paddingVertical: 8,
        paddingHorizontal: 5,
        marginTop: 5,
        marginBottom: 10,
        borderRadius: 5
      },
});

export default UpdateProductStockModal;