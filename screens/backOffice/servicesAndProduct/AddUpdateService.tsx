import { Ionicons } from "@expo/vector-icons";
import React, { FC, useLayoutEffect, useState } from "react";
import { ScrollView, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from "react-native";
import { FontSize, GlobalColors, GradientButtonColor } from "../../../Styles/GlobalStyleConfigs";
import RadioButtonGroup from "../../../components/RadioButtonGroup";
import { genderOptions } from "../../../utils/Constants";
import { LinearGradient } from "expo-linear-gradient";
import TextFieldWithBorderHeader from "../../../components/HeaderTextField";

const AddUpdateService = ({ navigation, route }: any) => {

    const isAdd = route.params.isAdd;
    const headerTitle = route.params.headerTitle;

    const [isActive, setIsActive] = useState<boolean>(false);
    const [name, setName] = useState<string>("");
    const [position, setPosition] = useState<string>(route.params.position ?? "");
    const [gender, setGender] = useState<string>(genderOptions[0]);
    const [hideFromCatalogue, setHideFromCatalogue] = useState<boolean>(false);
    const [price, setPrice] = useState<string>("");
    const [salePrice, setSalePrice] = useState<string>("");

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: `${headerTitle} / ${isAdd ? 'New Item' : route.params.selectedItem.name}`,
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
                        
                    </View>
                </View>
                <View style={styles.sectionView}>
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
                </View>

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
                            value={name}
                            placeholderTextColor="lightgray"
                            underlineColorAndroid="transparent"
                            onChangeText={(val) => { setName(val) }}
                        />
                    </View>
                    <View style={{ marginBottom: 10 }}>
                        <Text>Video Link</Text>
                        <TextInput
                            style={styles.textInput}
                            placeholder=""
                            value={name}
                            placeholderTextColor="lightgray"
                            underlineColorAndroid="transparent"
                            onChangeText={(val) => { setName(val) }}
                        />
                    </View>

                    <View style={{ marginBottom: 10 }}>
                        <Text>Benefits</Text>
                        <View style={[styles.textInput, { height: 100 }]}>
                            <TextInput
                                placeholder=""
                                multiline
                                numberOfLines={10}
                                value={name}
                                placeholderTextColor="lightgray"
                                underlineColorAndroid="transparent"
                                onChangeText={(val) => { setName(val) }}
                            />
                        </View>
                    </View>

                    <View style={{marginRight: 10, marginTop: 10}}>
                        <View style={{flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
                            <Text style={{ fontSize: FontSize.medium, paddingVertical: 5, fontWeight: "bold" }}>Description</Text>
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
    rowView: { flexDirection: 'row', alignItems: 'center', marginVertical: 10 },

});

export default AddUpdateService;
