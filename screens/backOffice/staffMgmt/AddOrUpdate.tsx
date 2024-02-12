import React, { useEffect, useLayoutEffect, useState } from "react";
import { Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ScrollView, TextInput } from "react-native-gesture-handler";
import { FontSize, GlobalColors, GradientButtonColor } from "../../../Styles/GlobalStyleConfigs";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import CheckBox from "expo-checkbox";
import { useAppDispatch, useAppSelector } from "../../../redux/Hooks";
import { setIsLoading, setShowBackOfficeCategories } from "../../../redux/state/UIStates";
import { environment } from "../../../utils/Constants";
import { selectBranchId, selectTenantId } from "../../../redux/state/UserStates";
import { makeAPIRequest } from "../../../utils/Helper";
import WeeklyOffModal from "./WeeklyOffModal";
import Toast from "react-native-root-toast";
import RadioButtonGroup from "../../../components/RadioButtonGroup";
import CustomDropdown from "../../../components/CustomDropdown";
import { useIsFocused } from "@react-navigation/native";

const AddOrUpdate = ({ navigation, route }: any) => {
    const dispatch = useAppDispatch();
    const isFocused = useIsFocused();
    const tenantId = useAppSelector(selectTenantId);
    const storeId = useAppSelector(selectBranchId);

    const selectedStaff = route.params?.selectedStaff;
    const rolesData = route.params?.rolesData;
    const rolesOptions = rolesData.map((role: any) => role.name);
    const genderOptions = ['Male', 'Female', 'Other'];

    const [active, setActive] = useState<boolean>(selectedStaff?.active || false);
    const [appointment, setAppointment] = useState<boolean>(selectedStaff?.enableAppointments || false);
    const [gender, setGender] = useState<string>(selectedStaff?.gender || "");
    const [selectedRole, setSelectedRole] = useState<string>("Select Role");
    const [firstName, setFirstName] = useState<string>(selectedStaff?.firstName || "");
    const [lastName, setLastName] = useState<string>(selectedStaff?.lastName || "");
    const [mobile, setMobile] = useState<string>(selectedStaff?.mobile || "");
    const [email, setEmail] = useState<string>(selectedStaff?.email || "");
    const [password, setPassword] = useState<string>(selectedStaff?.pwd || "");
    const [username, setUsername] = useState<string>(selectedStaff?.username || "");
    const [useMobileAsUser, setUseMobileAsUser] = useState<boolean>(selectedStaff?.username === selectedStaff?.mobile ? true : false);
    const [weeklyOff, setWeeklyOff] = useState<string[]>(selectedStaff?.weeklyOff && selectedStaff.weeklyOff != null ? selectedStaff.weeklyOff : []);
    const [modalVisible, setModalVisible] = useState(false);

    const toggleModal = () => {
        setModalVisible(!modalVisible);
    };

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: selectedStaff ? "Staff Details" : "Create Staff",
            headerTitleAlign: 'left',
            headerLeft: () => (
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name={"chevron-back-outline"} size={20} style={{ marginHorizontal: 5, color: GlobalColors.blue }} />
                </TouchableOpacity>
            ),
        });
    }, [navigation]);

    const handleRoleSelect = (index: number) => {
        setSelectedRole(rolesOptions[index]);
    };

    const handleGenderSelect = (gender: string) => {
        setGender(gender);
    };

    const updateWeeklyOff = (weeklyOffList: string[]) => {
        setWeeklyOff(weeklyOffList)
    };

    const handleSubmit = async () => {
        if (!isFormValidated()) {
            Toast.show("Complete the form", { duration: Toast.durations.SHORT, backgroundColor: GlobalColors.error, opacity: 1 })
            return
        }
        dispatch(setIsLoading({ isLoading: true }));
        //TODO : ssroles API call can be avoided if role is not changed
        const url = environment.sqlBaseUri + "staffs";
        let roleId = rolesData.find((role: any) => role.name === selectedRole)?.id;
        let requestBody: { [key: string]: any } = {
            "active": active ? 1 : 0,
            "address": selectedStaff?.address || null,
            "birthday": selectedStaff?.birthday || null,
            "email": email,
            "enableAppointments": appointment ? 1 : 0,
            "experience": selectedStaff?.experience || 0,
            "firstName": firstName,
            "lastName": lastName,
            "gender": gender,
            "mobile": mobile,
            "phone": selectedStaff?.phone || null,
            "pwd": password,
            "role": roleId,
            "tenantId": tenantId,
            "username": username,
        };
        if (selectedStaff) {
            requestBody["id"] = selectedStaff.id;
            requestBody["weeklyOff"] = weeklyOff;
        }
        let response = await makeAPIRequest(url, requestBody, "POST");
        let roleResponse = await getRoleMapping(roleId, response.id);
        dispatch(setIsLoading({ isLoading: false }));
        if (response && roleResponse) {
            Toast.show("Updated Successfully", { backgroundColor: GlobalColors.success });
            navigation.goBack();
        } else {
            Toast.show("Failed to Update", { backgroundColor: GlobalColors.error });
        }
    };

    const getRoleMapping = async (roleId: number, staffId: number): Promise<boolean> => {
        let requestBody = [{
            "active": active ? 1 : 0,
            "roleId": roleId,
            "staffId": staffId,
            "storeId": storeId,
            "tenantId": tenantId
        }];
        let response = await makeAPIRequest(environment.sqlBaseUri + "ssroles", requestBody, "POST");
        return response ? true : false;
    };


    const getRoleOfStaff = async () => {
        dispatch(setIsLoading({ isLoading: true }));
        const url = environment.sqlBaseUri + `ssroles/staff/${selectedStaff.id}`;
        let response = await makeAPIRequest(url, null, "GET");
        dispatch(setIsLoading({ isLoading: false }));
        if (response) {
            const role = rolesData.find((role: any) => role.id === response[0].roleId).name;
            setSelectedRole(role);
        }
    };

    const isFormValidated = () => {
        return firstName && lastName && mobile && gender && selectedRole != "Select Role" && username && password;
    };

    useEffect(() => {
        dispatch(setShowBackOfficeCategories());
       if(isFocused && selectedStaff) getRoleOfStaff();
    }, [isFocused]);


    return (
        <View style={{ flex: 1, padding: 10, marginBottom: 20, backgroundColor: '#fff' }}>
            <WeeklyOffModal weeklyOff={weeklyOff} updateWeeklyOff={updateWeeklyOff} modalVisible={modalVisible} toggleModal={toggleModal} />
            <ScrollView>
                <View style={{ flexDirection: 'row', marginVertical: 10, justifyContent: 'flex-start' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 30 }}>
                        <Text style={{ paddingHorizontal: 5, fontWeight: '300' }}>Active</Text>
                        <CheckBox
                            value={active}
                            onValueChange={() => setActive(!active)}
                            color={active ? GlobalColors.blue : undefined}
                        />
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ paddingHorizontal: 5, fontWeight: '300' }}>Enable Appointments</Text>
                        <CheckBox
                            value={appointment}
                            onValueChange={() => setAppointment(!appointment)}
                            color={active ? GlobalColors.blue : undefined}
                        />
                    </View>

                </View>

                <Text style={{ fontWeight: '300', marginTop: 20, marginHorizontal: 5 }}>Gender</Text>
                <RadioButtonGroup
                    options={genderOptions}
                    selectedOption={gender}
                    onSelect={handleGenderSelect}
                />
                <Text style={{ fontWeight: '300', marginTop: 20, marginHorizontal: 5 }}>Select Role</Text>

                <View style={{ flexDirection: 'row', width: '80%', alignItems: 'center', justifyContent: 'space-evenly' }}>
                    <View style={{marginHorizontal: 10, width: 150, marginRight: 15,}}>
                    <CustomDropdown data={rolesOptions} onSelect={setSelectedRole} renderContent={() => (
                        <View style={styles.roleSelectRect}>
                            <Text style={{ textTransform: 'capitalize' }}>{selectedRole}</Text>
                            <Ionicons name="chevron-down" size={20} style={{ marginLeft: 5, color: GlobalColors.blue }} />
                        </View>
                    )}>
                    </CustomDropdown>
                    </View>
                    
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 15 }}>
                        <View style={{ padding: 10 }}>
                            <Text style={{ fontSize: FontSize.regular, fontWeight: '300' }}>Weekly</Text>
                            <Text style={{ fontSize: FontSize.regular, fontWeight: '300' }}>Off</Text>
                        </View>
                        <Ionicons name={"calendar-outline"} size={20} style={{ marginHorizontal: 5, padding: 5, backgroundColor: GlobalColors.lightGray2, borderRadius: 5 }}
                            onPress={toggleModal}
                        />
                    </View>
                </View>

                <View style={{ marginHorizontal: 10 }}>
                    <Text style={{ marginTop: 20 }}>First Name</Text>
                    <TextInput
                        style={styles.textInput}
                        placeholder=""
                        value={firstName}
                        placeholderTextColor="lightgray"
                        underlineColorAndroid="transparent"
                        onChangeText={(val) => { setFirstName(val) }}
                    />
                    <Text style={{ marginTop: 20 }}>Last Name</Text>
                    <TextInput
                        style={styles.textInput}
                        value={lastName}
                        placeholderTextColor="lightgray"
                        underlineColorAndroid="transparent"
                        onChangeText={(val) => { setLastName(val) }}
                    />
                    <Text style={{ marginTop: 20 }}>Mobile Number</Text>
                    <TextInput
                        style={styles.textInput}
                        value={mobile}
                        placeholderTextColor="lightgray"
                        underlineColorAndroid="transparent"
                        onChangeText={(val) => {
                            setMobile(val);
                            val == username ? setUseMobileAsUser(true) : setUseMobileAsUser(false);

                        }}
                    />
                    <Text style={{ marginTop: 20 }}>Email</Text>
                    <TextInput
                        style={styles.textInput}
                        value={email}
                        placeholderTextColor="lightgray"
                        underlineColorAndroid="transparent"
                        onChangeText={(val) => { setEmail(val) }}
                    />

                    <Text style={{ marginTop: 20 }}>User Name</Text>
                    <View style={{ flexDirection: 'row' }}>
                        <TextInput
                            style={[styles.textInput, { width: '50%' }]}
                            value={username}
                            placeholderTextColor="lightgray"
                            underlineColorAndroid="transparent"
                            onChangeText={(val) => {
                                setUsername(val);
                                val == mobile ? setUseMobileAsUser(true) : setUseMobileAsUser(false);
                            }}
                        />
                        <View style={{ width: '40%', marginLeft: 20, flexDirection: 'row', alignItems: 'center' }}>
                            <Text>Use Mobile as Username</Text>
                            <CheckBox
                                style={{ marginLeft: 10 }}
                                value={useMobileAsUser}
                                onValueChange={() => {
                                    if (!useMobileAsUser) {
                                        setUsername(mobile);
                                        setUseMobileAsUser(!useMobileAsUser);
                                    }
                                }}
                                color={useMobileAsUser ? GlobalColors.blue : undefined}
                            />
                        </View>

                    </View>

                    <Text style={{ marginTop: 20 }}>Password</Text>
                    <TextInput
                        style={styles.textInput}
                        value={password}
                        placeholderTextColor="lightgray"
                        underlineColorAndroid="transparent"
                        secureTextEntry={true}
                        onChangeText={(val) => { setPassword(val) }}
                    />
                </View>

            </ScrollView>
            <View style={styles.buttons}>
                <TouchableOpacity onPress={() => { navigation.goBack() }} style={styles.cancelButtom}>
                    <Text style={[styles.cancelButtonText, { color: GlobalColors.blue }]}>Cancel</Text>
                </TouchableOpacity>
                <LinearGradient
                    colors={GradientButtonColor}
                    style={styles.cancelButtom}
                    start={{ y: 0.0, x: 0.0 }}
                    end={{ y: 0.0, x: 1.0 }}
                >
                    <TouchableOpacity onPress={() => {
                        handleSubmit()
                    }} >
                        <Text style={[styles.cancelButtonText, { color: '#fff' }]}>{selectedStaff ? "Update" : "Create"}</Text>
                    </TouchableOpacity>
                </LinearGradient>
            </View>
        </View>

    )
};

export default AddOrUpdate;

const styles = StyleSheet.create({
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
        marginTop: 20,
        justifyContent: 'space-evenly', width: '100%'
    },
    roleSelectRect: {
        backgroundColor: GlobalColors.lightGray2,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 5
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
        marginVertical: 10
    },

});