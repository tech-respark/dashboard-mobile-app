import { FC, useState } from "react";
import { ColorValue, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { FontSize, GlobalColors } from "../Styles/GlobalStyleConfigs";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Ionicons } from "@expo/vector-icons";

type TextFieldWithBorderHeaderProps = {
  value: string,
  setValue?: (val: string) => void,
  setValueWithIndex?: (val: string, index: number) => void;
  setValueWithIndexAndType?: (val: string, index: number, type: string) => void;
  type?: string,
  index?: number,
  header: string,
  width?: number,
  showSymbol: boolean,
  headerBackground?: ColorValue,
}

type TimerWithBorderHeaderProps = {
  value: string,
  setValue: (val: string) => void,
  header: string,
  width?: number,
}

export const TextFieldWithBorderHeader: FC<TextFieldWithBorderHeaderProps> = ({ value, setValue, header, showSymbol, index, setValueWithIndex, width, headerBackground = "#fff", setValueWithIndexAndType, type }) => {
  return (
    <View style={[styles.container, { width: width ?? "40%" }]}>
      <View style={[styles.header, { backgroundColor: headerBackground }]}>
        <Text style={styles.headerText}>{header}</Text>
      </View>
      <View style={styles.inputContainer}>
        {showSymbol && <Text style={{ fontSize: FontSize.medium }}>₹</Text>}
        <TextInput
          style={styles.textInput}
          placeholder=""
          value={value}
          placeholderTextColor="lightgray"
          underlineColorAndroid="transparent"
          onChangeText={(val) => {
            index == undefined ? setValue!(val) : (type == undefined ? setValueWithIndex!(val, index!) : setValueWithIndexAndType!(val, index, type))
          }}
        />
      </View>
    </View>
  );
};

export const TimerWithBorderHeader: FC<TimerWithBorderHeaderProps> = ({ value, setValue, header, width }) => {
  const [isTimePickerVisible, setIsTimePickerVisible] = useState<boolean>(false);
  return (
    <View style={[styles.container, { width: width ?? "40%" }]}>
      <View style={[styles.header, { backgroundColor: "#fff" }]}>
        <Text style={styles.headerText}>{header}</Text>
      </View>
      <Pressable style={[styles.inputContainer, {padding: 10, justifyContent: 'space-between'}]}
        onPress={()=>setIsTimePickerVisible(true)}
      >
          <Text>{value}</Text>
          <Ionicons name="timer-outline" size={20} color={GlobalColors.blue}/>
      </Pressable>
      <DateTimePickerModal
        isVisible={isTimePickerVisible}
        mode="time"
        onConfirm={async (time) => {
          setValue(time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }));
          setIsTimePickerVisible(false);
        }}
        onCancel={() => setIsTimePickerVisible(false)}
      />
    </View>
  );
};

export const HeaderedComponent = ({ header, children }: any) => {
  return (
    <View>
      <View style={[styles.header, header && { backgroundColor: "#fff" }]}>
        <Text style={styles.headerText}>{header}</Text>
      </View>
      {children}
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    width: "40%"
  },
  header: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    zIndex: 1,
    marginLeft: 15,
    marginTop: -8,
    paddingHorizontal: 5
  },
  headerText: {
    color: GlobalColors.blue,
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

