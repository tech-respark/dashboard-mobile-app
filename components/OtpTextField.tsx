import React, { useRef, useState, useEffect } from 'react';
import { TextInput, StyleSheet, View } from 'react-native';
import { FontSize, GlobalColors } from '../Styles/GlobalStyleConfigs';

interface OTPInputProps {
  numberOfDigits: number;
  onOtpChange: (otp: string) => void;
}

const OTPInput: React.FC<OTPInputProps> = ({ numberOfDigits, onOtpChange }) => {
  const inputRefs = useRef<Array<TextInput | null>>([]);
  const [otp, setOTP] = useState('');

  useEffect(() => {
    onOtpChange(otp);
  }, [otp, onOtpChange]);

  const handleTextChange = (text: string, index: number) => {
    if (inputRefs.current[index]) {
      inputRefs.current[index]?.setNativeProps({ text });
    }
    if (text && index < numberOfDigits - 1) {
      inputRefs.current[index + 1]?.focus();
    }
    setOTP((prevOTP) => {
      let updatedOTP = prevOTP;
      if (text) {
        updatedOTP = prevOTP + text;
      } else {
        updatedOTP = prevOTP.slice(0, -1);
      }
      return updatedOTP;
    });
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const renderInputs = () => {
    const inputs = [];
    for (let i = 0; i < numberOfDigits; i++) {
      inputs.push(
        <TextInput
          key={i}
          ref={(ref) => (inputRefs.current[i] = ref)}
          style={styles.input}
          keyboardType="number-pad"
          maxLength={1}
          onChangeText={(text) => handleTextChange(text, i)}
          onKeyPress={(e) => handleKeyPress(e, i)}
        />
      );
    }

    return inputs;
  };

  return <View style={styles.container}>{renderInputs()}</View>;
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  input: {
    width: 40,
    height: 40,
    borderColor: 'gray',
    backgroundColor: GlobalColors.lightGray2,
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 18,
  },
});

export default OTPInput;
