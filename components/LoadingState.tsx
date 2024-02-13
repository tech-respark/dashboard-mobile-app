import React, { FC } from "react";
import { Text, View } from "react-native";
import { FontSize, GlobalColors } from "../Styles/GlobalStyleConfigs";
import { ActivityIndicator } from "react-native";

interface ILoadingState {
    loader: boolean,
    message?: string
}

const LoadingState: FC<ILoadingState> = ({ loader, message }) => {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            {loader &&
                <ActivityIndicator color={GlobalColors.blueLight} style={{marginBottom: 10}}/>
            }
            <Text style={{ textAlign: 'center', fontSize: FontSize.medium }}>{loader ? "Loading" : message ?? "No Data Found"}</Text>
        </View>
    );
};

export default LoadingState;