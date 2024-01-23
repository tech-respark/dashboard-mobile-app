import { Ionicons } from "@expo/vector-icons";
import { DrawerContentScrollView } from "@react-navigation/drawer";
import { StyleSheet, View } from "react-native";
import { FontSize, GlobalColors } from "../../Styles/GlobalStyleConfigs";
import { Text } from "react-native";
import { useAppSelector } from "../../redux/Hooks";
import { selectUserData } from "../../redux/state/UserStates";
import { TouchableOpacity } from "react-native-gesture-handler";
import { mainTabsIconsMap } from "../../utils/Constants";

const CustomDrawerContent = ({ navigation, state }: any) => {
    const userData = useAppSelector(selectUserData);
    const mainTabs = ["POS", "Appointment", "Backoffice", "CRM", "Setting", "Reports", "Expenses", "Campaign"];

    return (
        <DrawerContentScrollView>
            <View>
                <View style={styles.topProfileView}>
                    <View style={styles.iconCircle}>
                        <Ionicons name="person-outline" size={25} color={GlobalColors.blue} />
                    </View>
                    <View style={{ flexDirection: 'column', marginHorizontal: 20, justifyContent: 'center' }}>
                        <Text style={{ fontSize: FontSize.large, marginBottom: 5 }}>{userData?.firstName} {userData?.lastName}</Text>
                        <Text style={{ color: 'gray' }}>{userData?.email}</Text>
                    </View>
                </View>
                <View style={{ width: '80%', justifyContent: 'center', alignSelf: 'flex-end', marginTop: 20 }}>
                    {mainTabs.map((item: string, index: number) => (
                        <TouchableOpacity
                            style={[
                                { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, marginVertical: 8 },
                                state.index === index ? styles.selectedItem : null,
                            ]}
                            key={index}
                            onPress={() => {
                                navigation.navigate(item);
                                navigation.closeDrawer();
                            }}
                        >
                            <Ionicons name={mainTabsIconsMap[item] as 'key'} size={20} color={state.index === index ? "#fff" : '#000'} style={{ marginHorizontal: 15 }} />
                            <Text style={{ color: state.index === index ? '#fff' : '#000' }}>{item}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        </DrawerContentScrollView>
    );
};

const styles = StyleSheet.create({
    topProfileView: {
        padding: 16,
        marginVertical: 20,
        marginHorizontal: 10,
        flexDirection: 'row',
        borderBottomWidth: 1,
        paddingBottom: 25,
        borderColor: 'lightgray'
    },
    iconCircle: {
        width: 50,
        height: 50,
        borderRadius: 40,
        justifyContent: 'center',
        backgroundColor: GlobalColors.lightGray2,
        alignItems: 'center',
    },
    selectedItem: {
        backgroundColor: GlobalColors.grayDark,
        borderTopLeftRadius: 15,
        borderBottomLeftRadius: 15
    }
});

export default CustomDrawerContent;