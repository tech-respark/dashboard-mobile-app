import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Switch, ScrollView } from "react-native";
import { FontSize, GlobalColors, GradientButtonColor } from "../../../Styles/GlobalStyleConfigs";
import { TextInput } from "react-native-gesture-handler";
import RadioButtonGroup from "../../../components/RadioButtonGroup";
import { LinearGradient } from "expo-linear-gradient";
import { useAppDispatch, useAppSelector } from "../../../redux/Hooks";
import { setIsLoading } from "../../../redux/state/UIStates";
import { makeAPIRequest } from "../../../utils/Helper";
import { environment } from "../../../utils/Constants";
import { selectBranchId, selectStaffData, selectTenantId } from "../../../redux/state/UserStates";
import ModalDropdown from 'react-native-modal-dropdown';

const AddNewOrEdit = ({ navigation, route }: any) => {
    const dispatch = useAppDispatch();
    const storeId = useAppSelector(selectBranchId);
    const tenantId = useAppSelector(selectTenantId);
    const genderOptions: string[] = ["Both", "Male", "Female"];
    const isAddNew = route.params.isAddNew;
    const type = route.params.type;
    const staffList = useAppSelector(selectStaffData);
    const staffsNameList = staffList!.map(item => `${item.firstName} ${item.lastName}`);


    const [isActive, setIsActive] = useState<boolean>(false);
    const [name, setName] = useState<string>("");
    const [position, setPosition] = useState<string>("");
    const [gender, setGender] = useState<string>("");
    const [experts, setExperts] = useState<{ [key: string]: any }[]>([]);
    const [showExpertsSection, setShowExpertSection] = useState<boolean>(false);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: isAddNew ? "New Category" : route.params.item.name,
            headerTitleAlign: 'left',
            headerLeft: () => (
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name={"chevron-back-outline"} size={20} style={{ marginHorizontal: 5, color: GlobalColors.blue }} />
                </TouchableOpacity>
            ),
        });
    }, [navigation]);

    const getCategoryInformation = async () => {
        dispatch(setIsLoading({ isLoading: true }));
        let url = environment.documentBaseUri + `stores/categories/getAllStoresCategoriesByCategoryId?tenantId=${tenantId}&catId=${route.params.categoryId}`;
        url += route.params.subCategoryId ? `&subCatId=${route.params.subCategoryId}` : '';
        console.log(url);
        let response = await makeAPIRequest(url, null, "GET");
        dispatch(setIsLoading({ isLoading: false }));
        const responseData = response[storeId!];
        if (responseData) {
            setIsActive(responseData.active);
            setName(responseData.name);
            setPosition(String(responseData.index));
            setGender(responseData.group.charAt(0).toUpperCase() + responseData.group.slice(1));
            getExperts(responseData);
        }
    };

    const getExperts = (data: any) => {
        if (data.categoryList.length > 0) {
            setShowExpertSection(false)
        } else {
            setShowExpertSection(true);
            const uniqueExperts: { [key: string]: any } = {};
            data.itemList.forEach((item: any) => {
                item["experts"].forEach((expert: any) => {
                    uniqueExperts[expert.id] = expert;
                });
            });
            const temp = Object.values(uniqueExperts);
            const matchingObjects: { [key: string]: any }[] = [];
            temp.forEach((expert: any) => {
                const matchingDataItem = staffList!.find((fullData: any) => fullData.id === expert.id);
                if (matchingDataItem) {
                    matchingObjects.push(matchingDataItem);
                }
            });
            setExperts(matchingObjects);
        }
    };

    const handleStaffSelect = (index: number) => {
        let expertObject = staffList![index];
        experts.some(expert => expert.id === expertObject.id) ? null : setExperts(prevExperts => [...prevExperts, expertObject]);
    };

    const removeExpert = (item: any) => {
        const updatedExperts = experts.filter(expert => expert.id !== item.id);
        setExperts(updatedExperts);
    };

    useEffect(() => {
        (type === "service" && !isAddNew) ? getCategoryInformation() : null;
    }, []);
    return (
        <View style={{ flex: 1 }}>
            <ScrollView style={styles.container}>
                <View style={styles.sectionView}>
                    <View style={styles.rowView}>
                        <Text>Active</Text>
                        <Switch
                            style={styles.switch}
                            trackColor={{ false: '', true: GlobalColors.blue }}
                            onValueChange={() => { setIsActive(!isActive) }}
                            value={isActive}
                        />
                    </View>

                    <View style={styles.rowView}>
                        <Text>Name</Text>
                        <Text style={{ color: 'red' }}>*</Text>
                        <TextInput
                            style={styles.textInput}
                            placeholder=""
                            value={name}
                            placeholderTextColor="lightgray"
                            underlineColorAndroid="transparent"
                            onChangeText={(val) => { setName(val) }}
                        />
                    </View>

                    <View style={[styles.rowView, { width: '50%' }]}>
                        <Text>Position</Text>
                        <TextInput
                            style={[styles.textInput,]}
                            placeholder=""
                            value={position}
                            placeholderTextColor="lightgray"
                            underlineColorAndroid="transparent"
                            keyboardType="number-pad"
                            onChangeText={(val) => { setPosition(val) }}
                        />
                    </View>
                </View>

                <View style={styles.sectionView}>
                    <Text style={{ fontSize: FontSize.medium, paddingVertical: 5 }}>Group</Text>
                    <RadioButtonGroup
                        options={genderOptions}
                        selectedOption={gender}
                        onSelect={(val: string) => { setGender(val) }}
                    />
                </View>

                <View style={styles.sectionView}>
                    <Text style={{ fontSize: FontSize.medium, paddingVertical: 5 }}>Icons</Text>
                </View>


                <View style={styles.sectionView}>
                    <Text style={{ fontSize: FontSize.medium, paddingVertical: 5 }}>Display Images</Text>
                </View>
                {!isAddNew && type == "service" && showExpertsSection &&
                    <View style={styles.sectionView}>
                        <Text style={{ fontSize: FontSize.medium, paddingVertical: 5 }}>Experts</Text>
                        <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                            {experts.map((item: any) => (
                                <View style={styles.pillView} key={item.id}>
                                    <Text>{item.firstName} {item.lastName}</Text>
                                    <Ionicons name={"close"} size={15} color={GlobalColors.blue} style={{ marginHorizontal: 2 }} onPress={() => {
                                        removeExpert(item);
                                    }} />
                                </View>
                            ))}
                        </View>
                        <View style={{ width: '50%' }}>
                            <ModalDropdown
                                options={staffsNameList}
                                onSelect={handleStaffSelect}
                                dropdownStyle={[styles.dropdownContainer, { height: 40 * staffsNameList.length }]}
                                dropdownTextStyle={styles.dropdownOption}
                                dropdownTextHighlightStyle={styles.selectedOption}
                            >
                                <View style={styles.addExpertView}>
                                    <Text style={{ fontSize: FontSize.medium }}>Add Expert</Text>
                                    <Ionicons name="chevron-down" size={20} style={{ marginLeft: 5, color: GlobalColors.blue }}/>
                                </View>
                            </ModalDropdown>
                        </View>
                    </View>
                }

            </ScrollView>
            <View style={styles.buttons}>
                <TouchableOpacity onPress={() => { navigation.goBack() }} style={[styles.cancelButtom, { alignItems: 'center' }]}>
                    <Text style={[styles.cancelButtonText, { color: GlobalColors.blue }]}>Cancel</Text>
                </TouchableOpacity>
                <LinearGradient
                    colors={GradientButtonColor}
                    style={styles.cancelButtom}
                    start={{ y: 0.0, x: 0.0 }}
                    end={{ y: 0.0, x: 1.0 }}
                >
                    <TouchableOpacity onPress={() => {

                    }} >
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={[styles.cancelButtonText, { color: '#fff' }]}>Submit</Text>
                            <Ionicons name="checkmark" size={25} color={"#fff"} />
                        </View>
                    </TouchableOpacity>
                </LinearGradient>
            </View>
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 5,
        paddingVertical: 10
    },
    sectionView: { backgroundColor: '#fff', borderRadius: 5, padding: 10, marginHorizontal: 5, marginVertical: 5 },
    switch: {
        transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
        marginHorizontal: 10
    },
    textInput: {
        flex: 1,
        fontSize: FontSize.regular,
        color: 'black',
        width: '90%',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderWidth: 1,
        borderRadius: 5,
        borderColor: 'lightgray',
        marginVertical: 10,
        marginLeft: 10
    },
    rowView: { flexDirection: 'row', alignItems: 'center', marginVertical: 10 },
    cancelButtom: {
        borderWidth: 1,
        paddingVertical: 8,
        paddingHorizontal: 30,
        borderRadius: 20,
        borderColor: GlobalColors.blue
    },
    cancelButtonText:
    {
        fontSize: FontSize.large,
        paddingHorizontal: 20
    },
    nameText: {
        fontSize: FontSize.large,
        marginBottom: 10
    },
    mobileText: {
        fontWeight: '300',
        fontSize: FontSize.medium
    },
    buttons: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        width: '100%',
        backgroundColor: '#fff',
        paddingTop: 20,
        paddingBottom: 30
    },
    pillView: {
        flexDirection: 'row',
        paddingVertical: 8,
        paddingHorizontal: 10,
        margin: 10,
        borderRadius: 20,
        backgroundColor: GlobalColors.lightGray2,
        borderColor: GlobalColors.blue,
        alignItems: 'center'
    },
    dropdownContainer: {
        marginTop: 10,
        width: 150,
        backgroundColor: GlobalColors.lightGray2
    },
    dropdownOption: {
        fontSize: 16,
        padding: 8,
        textAlign: 'auto',
        flexWrap: 'wrap',
        backgroundColor: GlobalColors.lightGray2,
        textTransform: 'capitalize'
    },
    selectedOption: {
        color: 'black'
    },
    addExpertView: {
        margin: 10,
        flexDirection: 'row',
        borderRadius: 20,
        borderWidth: 1.5,
        borderColor: GlobalColors.blue,
        padding: 5,
        justifyContent: 'space-evenly'
    }
});

export default AddNewOrEdit;

