import React from "react";
import { Text, View } from "react-native";
import { GlobalStyles } from "../../../Styles/Styles";
import { FontSize } from "../../../Styles/GlobalStyleConfigs";

const Services = () => {
    return (
        <View style={{padding: 10}}>
            <Text style={{fontSize: FontSize.large, fontWeight: 'bold', padding: 5}}>Category</Text>
        </View>
    )
};

export default Services;