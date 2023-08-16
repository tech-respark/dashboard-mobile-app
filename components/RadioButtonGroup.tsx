import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { GlobalColors } from "../Styles/GlobalStyleConfigs";

const RadioButtonGroup = ({ options, selectedOption, onSelect }: any) => {
    return (
        <View style={styles.container}>
            {options.map((option: any) => (
                <View key={option} style={{ flexDirection: 'row' }}>
                    <TouchableOpacity style={styles.radioInnerCircle} onPress={() => onSelect(option)}>
                        {selectedOption === option && <View style={styles.selectedRadioInnerCircle} />}
                    </TouchableOpacity>
                    <Text style={{ fontWeight: '300', color: 'gray', textTransform: 'capitalize' }}>{option}</Text>
                </View>
            ))}
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '90%',
        justifyContent: 'space-evenly',
        marginVertical: 5
    },
    radioInnerCircle: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: GlobalColors.blue,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 5,
    },
    selectedRadioInnerCircle: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: GlobalColors.blue,
    }
});

export default RadioButtonGroup;