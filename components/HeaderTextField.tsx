import { FC } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { FontSize, GlobalColors } from "../Styles/GlobalStyleConfigs";

type TextFieldWithBorderHeaderProps = {
    value: string,
    setValue?: (val: string) => void,
    setValueWithIndex? : (val: string, index: number) => void;
    index? : number,
    header: string,
    width?: number,
    showSymbol: boolean
}
const TextFieldWithBorderHeader: FC<TextFieldWithBorderHeaderProps> = ({ value, setValue, header, showSymbol, index, setValueWithIndex, width }) => {
    return (
      <View style={[styles.container, {width: width ?? "40%"}]}>
        <View style={styles.header}>
          <Text style={styles.headerText}>{header}</Text>
        </View>
        <View style={styles.inputContainer}>
          {showSymbol && <Text style={{fontSize: FontSize.medium}}>₹</Text>}
          <TextInput
            style={styles.textInput}
            placeholder=""
            value={value}
            placeholderTextColor="lightgray"
            underlineColorAndroid="transparent"
            onChangeText={(val) => {
              index != undefined ? setValueWithIndex!(val, index!) : setValue!(val)}}
          />
        </View>
      </View>
    );
  };


const styles = StyleSheet.create({
    container: {
      marginVertical: 8,
      width: "40%"
    },
    header: {
      backgroundColor: '#fff',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'absolute',
      zIndex: 1,
      marginLeft: 15,
      marginTop: -8,
      paddingHorizontal: 5
    },
    headerText: {
      color: GlobalColors.blue
    },
    inputContainer: {
      borderRadius: 5,
      borderWidth: 1,
      borderColor: 'lightgray',
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 10
    },
    textInput: {
      height: 40,
      paddingHorizontal: 8,
    },
  });
  
  export default TextFieldWithBorderHeader;