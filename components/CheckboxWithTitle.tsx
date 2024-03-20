import Checkbox from "expo-checkbox";
import React, { FC } from "react";
import { Text, View } from "react-native";
import { GlobalStyles } from "../Styles/Styles";

interface ICheckboxWithTitle {
    value: boolean,
    setValue: (val: boolean) => void,
    msg: string
}

const CheckboxWithTitle: FC<ICheckboxWithTitle> = ({ value, setValue, msg }) => {
    return (
        <View style={[GlobalStyles.justifiedRow, { width: '35%' }]}>
            <Checkbox
                color={"#4FACFE"}
                style={{ borderColor: 'gray', borderRadius: 2, borderWidth: 0.5 }}
                value={value}
                onValueChange={() => setValue(!value)}
            />
            <Text>{msg}</Text>
        </View>
    );
};

export default CheckboxWithTitle;