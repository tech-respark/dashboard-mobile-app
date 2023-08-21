import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { ScrollView, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View, ViewBase } from "react-native";
import { FontSize, GlobalColors, GradientButtonColor } from "../../../Styles/GlobalStyleConfigs";
import { environment } from "../../../utils/Constants";
import { LinearGradient } from "expo-linear-gradient";
import TextFieldWithBorderHeader from "../../../components/HeaderTextField";
import Dropdown from "../../../components/Dropdown";
import UploadImageField from "../../../components/UploadImageField";
import SubmitCancelButtons from "../../../components/SubmitCancelButtons";
import Toast from "react-native-root-toast";
import { makeAPIRequest } from "../../../utils/Helper";
import { useAppDispatch, useAppSelector } from "../../../redux/Hooks";
import { selectBranchId, selectTenantId } from "../../../redux/state/UserStates";
import { setIsLoading } from "../../../redux/state/UIStates";

const AddUpdateService = ({ navigation, route }: any) => {

    const dispatch = useAppDispatch();
    const storeId = useAppSelector(selectBranchId);
    const tenantId = useAppSelector(selectTenantId);

    const isAdd = route.params.isAdd;
    const headerTitle = route.params.headerTitle;
    const categoryLevel = route.params.categoryLevel;

    const durationOptions: {[key: string]: string[]} = {"Minute(s)": ["0", "15", "30", "45", "60", "75", "90"], "Hour(s)": ["1", "2", "3", "4", "5"]};
    const durationTypesOptions = ["Minute(s)", "Hour(s)"];

    const [isActive, setIsActive] = useState<boolean>(true);
    const [name, setName] = useState<string>("");
    const [position, setPosition] = useState<string>(route.params.position ?? "");
    // const [gender, setGender] = useState<string>(genderOptions[0]);
    const [hideFromCatalogue, setHideFromCatalogue] = useState<boolean>(false);
    const [price, setPrice] = useState<string>("0");
    const [salePrice, setSalePrice] = useState<string>("0");
    const [durationType, setDurationType] = useState<string>(durationTypesOptions[0]);
    const [duration, setDuration] = useState<string>("");
    const [serviceTag, setServiceTag] = useState<string>("");
    const [videoLink, setVideoLink] = useState<string>("");
    const [benefits, setBenefits] = useState<string>("");
    const [description, setDescription] = useState<string[]>([""]);
    const [displayImages, setDisplayImages] = useState<{ [key: string]: any }[]>([]);


    useEffect(() => {
        setDuration(durationOptions[durationType][0]);
    }, [durationType]);
    
    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: `${headerTitle} / ${isAdd ? 'New Item' : route.params.clickedItem.name}`,
            headerTitleAlign: 'left',
            headerTitleStyle: {
                fontWeight: '400',
                fontSize: FontSize.medium,
                color: GlobalColors.blue
            },
            headerLeft: () => (
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name={"chevron-back-outline"} size={20} style={{ marginHorizontal: 5, color: GlobalColors.blue }} />
                </TouchableOpacity>
            ),
        });
    }, [navigation]);

    const updateDescriptionAtIndex = (val: string, index: number): void => {
        setDescription(prevDescriptions => {
            const updatedDescriptions = [...prevDescriptions];
            updatedDescriptions[index] = val;
            return updatedDescriptions;
        });
    };

    const createRequestBody = (): {[key: string]: any} => {
        let itemData: { [key: string]: any } = {
            active: isActive,
            benefits: benefits,
            combinationPricing: null,
            days: "All",
            duration: duration,
            durationType: durationType == durationTypesOptions[0] ? "min" : "hrs",
            experts: [],
            group: "both",
            hideFromCatalogue: hideFromCatalogue,
            howToUse: "",
            iTag: serviceTag,
            imagePaths: [],
            index: position,
            ingredients: "",
            name: name, 
            price: price,
            salePrice: salePrice,
            variations: [],
            videoLink: videoLink,
            description: description.join("|")
        };
        if (!isAdd) {
            itemData["id"] = route.params.clickedItem.id
        } else {
            itemData["type"] = "service"
        }
        let body: { [key: string]: any } = {
            case: categoryLevel+3,
            category: route.params.categoryId,
            item: itemData,
            status: isAdd ? "CREATE" : "UPDATE",
            storeIds: {active: [storeId]},
            tenantId: String(tenantId)
        }
        if (categoryLevel == 2) {
            body["subCategory"] = route.params.subCategoryId
        }
        return body;
    };

    const submitHandler = async() => {
        if(!name){
            Toast.show("Complete the form", {backgroundColor: GlobalColors.error, opacity: 1})
            return;
        }
        dispatch(setIsLoading({isLoading: true}));
        let response = await makeAPIRequest(environment.documentBaseUri+"stores/categories/items/update", createRequestBody(), "POST");
        dispatch(setIsLoading({isLoading: false}));
        if (response) {
            Toast.show("Added Successfully", { backgroundColor: GlobalColors.success, opacity: 1 });
            navigation.goBack();
        }
        else {
            Toast.show("Encountered Error", { backgroundColor: GlobalColors.error, opacity: 1 });
        }
    };

    const getItemInformation = async () => {
        dispatch(setIsLoading({ isLoading: true }));
        let url = environment.documentBaseUri + `stores/categories/getAllStoresItemsByItemId?tenantId=${tenantId}&itemId=${route.params.clickedItem.id}&catId=${route.params.categoryId}`;
        url += route.params.subCategoryId ? `&subCatId=${route.params.subCategoryId}` : '';
        let response = await makeAPIRequest(url, null, "GET");
        dispatch(setIsLoading({ isLoading: false }));
        const responseData = response[storeId!];
        if (responseData) {
            setIsActive(responseData.active);
            setName(responseData.name);
            setPosition(String(responseData.index));
            setDuration(responseData.duration);
            responseData.durationType  ? setDurationType(responseData.durationType == "min" ? durationTypesOptions[0]: durationTypesOptions[1]) : null;
            setDisplayImages(responseData?.imagePaths || []);
            setHideFromCatalogue(responseData.hideFromCatalogue);
            setPrice(String(responseData.price));
            setSalePrice(String(responseData.salePrice));
            setServiceTag(responseData.iTag);
            setVideoLink(responseData.videoLink);
            setBenefits(responseData.benefits);
            setDescription(responseData.description.split("|"));
        }
    };

    useEffect(()=>{
        !isAdd ? getItemInformation() : null;
    }, [])

    return (
        <View style={{ flex: 1 }}>
            <ScrollView style={styles.container}>
                <View style={styles.sectionView}>
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
                    <View style={[styles.rowView, { justifyContent: 'space-between' }]}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', width: '50%' }}>
                            <Text>Position</Text>
                            <Text style={{ color: 'red' }}>*</Text>
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
                        <View style={styles.rowView}>
                            <Text>Active</Text>
                            <Switch
                                style={styles.switch}
                                trackColor={{ false: '', true: GlobalColors.blue }}
                                onValueChange={() => { setIsActive(!isActive) }}
                                value={isActive}
                            />
                        </View>

                    </View>
                    <View style={[styles.rowView, { justifyContent: 'space-between' }]}>
                        <Dropdown data={durationOptions[durationType]} onSelect={setDuration} optionWidth={100} renderContent={() => (
                            <>
                                <Text style={styles.dropdownHeading}>Duration</Text>
                                <View style={styles.inputContainer}>
                                    <Text style={{ fontSize: FontSize.medium }}>{duration}</Text>
                                    <Ionicons name="chevron-down" size={20} />
                                </View>
                            </>
                        )} />
                        <Dropdown data={durationTypesOptions} onSelect={setDurationType} optionWidth={100} renderContent={() => (
                            <>
                                <Text style={styles.dropdownHeading}>Duration Type</Text>
                                <View style={[styles.inputContainer, { width: 150 }]}>
                                    <Text style={{ fontSize: FontSize.medium }}>{durationType}</Text>
                                    <Ionicons name="chevron-down" size={20} />
                                </View>
                            </>
                        )} />
                    </View>
                </View>
                <View style={styles.sectionView}>
                <View style={{ flexDirection: "row", alignItems: 'center', paddingTop: 10 }}>
                            <Text>Hide From Catalogue</Text>
                            <Switch
                                style={styles.switch}
                                trackColor={{ false: '', true: GlobalColors.blue }}
                                onValueChange={() => { setHideFromCatalogue(!hideFromCatalogue) }}
                                value={hideFromCatalogue}
                            />
                        </View>
                </View>
                {/* <View style={styles.sectionView}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                        <Text style={{ fontSize: FontSize.medium, paddingVertical: 5 }}>Group</Text>
                        <View style={{ flexDirection: "row", alignItems: 'center', paddingTop: 10 }}>
                            <Text>Hide From Catalogue</Text>
                            <Switch
                                style={styles.switch}
                                trackColor={{ false: '', true: GlobalColors.blue }}
                                onValueChange={() => { setHideFromCatalogue(!hideFromCatalogue) }}
                                value={hideFromCatalogue}
                            />
                        </View>
                    </View>
                    <RadioButtonGroup
                        options={genderOptions}
                        selectedOption={gender}
                        onSelect={(val: string) => {
                            setGender(val)
                        }}
                    />
                </View> */}

                <View style={styles.sectionView}>
                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-around" }}>
                        <TextFieldWithBorderHeader value={price} setValue={setPrice} header={"Price"} showSymbol={true} />
                        <TextFieldWithBorderHeader value={salePrice} setValue={setSalePrice} header={"Sale Price"} showSymbol={true} />
                    </View>
                </View>

                <View style={styles.sectionView}>
                    <View style={{ marginBottom: 10 }}>
                        <Text>Service Tag</Text>
                        <TextInput
                            style={styles.textInput}
                            placeholder=""
                            value={serviceTag}
                            placeholderTextColor="lightgray"
                            underlineColorAndroid="transparent"
                            onChangeText={(val) => { setServiceTag(val) }}
                        />
                    </View>
                    <View style={{ marginBottom: 10 }}>
                        <Text>Video Link</Text>
                        <TextInput
                            style={styles.textInput}
                            placeholder=""
                            value={videoLink}
                            placeholderTextColor="lightgray"
                            underlineColorAndroid="transparent"
                            onChangeText={(val) => { setVideoLink(val) }}
                        />
                    </View>

                    <View style={{ marginBottom: 10 }}>
                        <Text>Benefits</Text>
                        <View style={[styles.textInput, { height: 100 }]}>
                            <TextInput
                                placeholder=""
                                multiline
                                numberOfLines={10}
                                value={benefits}
                                placeholderTextColor="lightgray"
                                underlineColorAndroid="transparent"
                                onChangeText={(val) => { setBenefits(val) }}
                            />
                        </View>
                    </View>

                    <View style={{ marginRight: 10, marginTop: 10 }}>
                        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                            <Text style={{ fontSize: FontSize.medium, paddingVertical: 5, fontWeight: "bold" }}>Description</Text>
                            <LinearGradient
                                colors={GradientButtonColor}
                                style={styles.roundAddButton}
                                start={{ y: 0.0, x: 0.0 }}
                                end={{ y: 0.0, x: 1.0 }}
                            >
                                <Ionicons name="add" size={25} color={"#fff"} onPress={() => { 
                                    if(description[description.length-1]){
                                        setDescription(prevDescriptions => [...prevDescriptions, ""]);
                                    }
                                }} />
                            </LinearGradient>
                        </View>
                        {description.map((item: string, index: number) => (
                            <View key={index} style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
                                <TextFieldWithBorderHeader value={item} setValueWithIndex={updateDescriptionAtIndex} header={`Description ${index + 1}`} showSymbol={false} width={300} index={index}/>
                                <TouchableOpacity style={{ backgroundColor: GlobalColors.error, padding: 2, borderRadius: 20, marginLeft: 10 }} 
                                onPress={() => {
                                    if(index != 0){
                                    setDescription(prevDescriptions => {
                                        const updatedDescriptions = [...prevDescriptions];
                                        updatedDescriptions.splice(index, 1);
                                        return updatedDescriptions;
                                      });
                                    }
                                }}>
                                    <Ionicons name="close" size={20} color={"#fff"} />
                                </TouchableOpacity>
                            </View>
                        ))}
                    </View>
                </View>

                <View style={styles.sectionView}>
                    <Text style={{ fontSize: FontSize.medium, paddingVertical: 5 }}>Display Images</Text>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={true}
                        contentContainerStyle={{ paddingBottom: 10 }}
                    >
                        {
                            displayImages.map((item: any) => (
                                <UploadImageField imageUrl={item.imagePath} key={item.imagePath} />
                            ))
                        }
                        <UploadImageField imageUrl={""} />
                    </ScrollView>
                </View>
                {/* <View style={styles.sectionView}>
                    <View style={{ flexDirection: "row", alignItems: 'center', justifyContent: 'space-between' }}>
                        <Text style={{ fontSize: FontSize.medium, paddingVertical: 5 }}>Variation</Text>
                        <View style={{ flexDirection: "row", alignItems: "center", marginHorizontal: 10 }}>
                            <Text style={{ color: GlobalColors.blue }}>Add</Text>
                            <LinearGradient
                                colors={GradientButtonColor}
                                style={styles.roundAddButton}
                                start={{ y: 0.0, x: 0.0 }}
                                end={{ y: 0.0, x: 1.0 }}
                            >
                                <Ionicons name="add" size={25} color={"#fff"} onPress={()=> {}}/>
                            </LinearGradient>
                        </View>
                    </View>
                </View> */}
            </ScrollView>
            <SubmitCancelButtons cancelHandler={()=> {navigation.goBack()}} cancelText="Cancel" submitHandler={submitHandler} submitText="Submit" />
        </View>
    )
};

const styles = StyleSheet.create({
    roundAddButton: {
        padding: 2,
        borderRadius: 40,
        marginLeft: 10
    },
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
    inputContainer: {
        width: 120,
        height: 50,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: 'lightgray',
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 10,
        justifyContent: 'space-around'
    },
    rowView: { flexDirection: 'row', alignItems: 'center', marginVertical: 10 },
    dropdownHeading: { color: GlobalColors.blue, zIndex: 1, paddingHorizontal: 5, position: 'absolute', marginLeft: 5, marginTop: -8, backgroundColor: "#fff" },

});

export default AddUpdateService;
