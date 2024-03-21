import React, { FC, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { FontSize, GlobalColors } from "../../../Styles/GlobalStyleConfigs";
import Toast from "react-native-root-toast";

interface IPackages {
    customer: { [key: string]: any },
    setCustomer: (val: any) => void,
}

const Packages: FC<IPackages> = ({customer, setCustomer}) => {
    const [modalVisible, setModalVisible] = useState<boolean>(false);

    return (
        <View style={{ width: '100%', paddingVertical: 20, paddingHorizontal: 10 }}>
            {/* {modalVisible && </>} */}
            <View style={{ justifyContent: 'flex-end', flexDirection: 'row', marginBottom: 15 }}>
                <TouchableOpacity style={{ backgroundColor: GlobalColors.blue, borderRadius: 5 }}
                    onPress={() => { Toast.show("Will be added later") }}
                >
                    <Text style={{ color: "#fff", padding: 10, fontSize: FontSize.medium }}>Add Package</Text>
                </TouchableOpacity>
            </View>
            <Text style={{ fontSize: FontSize.medium, fontWeight: '500', marginBottom: 10 }}>Active Packages</Text>
            </View>
    );
};

const styles = StyleSheet.create({

});

export default Packages;
