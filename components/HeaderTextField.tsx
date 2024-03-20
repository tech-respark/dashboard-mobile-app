import { FC, useState } from "react";
import { ColorValue, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { FontSize, GlobalColors } from "../Styles/GlobalStyleConfigs";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Ionicons } from "@expo/vector-icons";
import TimeSlotModal from "../screens/appointment/createAppointment/TimeSlotModal";
import Toast from "react-native-root-toast";
import { useTimeIntervalList } from "../customHooks/AppointmentHooks";
import { ServiceDetailsType } from "../utils/Types";

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
  setValue: (val: string) => void,
  header: string,
  width?: number,
  isFrom: boolean,
  serviceObj: ServiceDetailsType
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

export const TimerWithBorderHeader: FC<TimerWithBorderHeaderProps> = ({ serviceObj, setValue, header, width, isFrom }) => {
  const expertTime = serviceObj.experts.length ? serviceObj.experts[0].slot : null
  const timeInterval = useTimeIntervalList(expertTime);
  const [timeSlotModal, setTimeSlotModal] = useState<boolean>(false);

  return (
    <View style={[styles.container, { width: width ?? "40%" }]}>
      <View style={[styles.header, { backgroundColor: "#fff" }]}>
        <Text style={styles.headerText}>{header}</Text>
      </View>
      <Pressable style={[styles.inputContainer, {padding: 10, justifyContent: 'space-evenly'}]}
        onPress={()=>{
          if(expertTime)
            setTimeSlotModal(true)
          else
          Toast.show("Select Expert First", {backgroundColor: GlobalColors.error, opacity: 1.0})
        }}
      >
          <Text style={{color : (isFrom && serviceObj.fromTime) || (!isFrom && serviceObj.toTime )? '#000' : 'gray'}}>{isFrom ? timeInterval[serviceObj.fromTime] ?? "Select Time": timeInterval[serviceObj.toTime] ?? "Select Time"}</Text>
          <Ionicons name="timer-outline" size={20} color={GlobalColors.blue}/>
      </Pressable>
      {timeSlotModal && <TimeSlotModal modalVisible={timeSlotModal} setModalVisible={setTimeSlotModal} isFrom={isFrom} timeInterval={timeInterval} setValue={setValue} 
        serviceObj={serviceObj}/>}
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
    marginLeft: 5,
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

