import React, { FC, useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

interface PasswordInputProps {
    placeholder: string;
    onChangeText: (text: string) => void;
}

const PasswordInput: React.FC<PasswordInputProps> = ({ placeholder, onChangeText }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [password, setPassword] = useState('');

    const togglePasswordVisibility = () => {
        setShowPassword((prevShowPassword) => !prevShowPassword);
    };

    const handleTextChange = (text: string) => {
        setPassword(text);
        onChangeText(text);
    };

    return (
        <View style={styles.inputContainer}>
            <TextInput
                style={styles.input}
                placeholder={placeholder}
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={handleTextChange}
                placeholderTextColor="gray"
                underlineColorAndroid="transparent"
            />
            <TouchableOpacity style={styles.iconContainer} onPress={togglePasswordVisibility}>
                <Ionicons name={showPassword ? 'eye-outline' : 'eye-off-outline'} size={20} color="gray" />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 0.4,
        borderColor: 'lightgray',
        paddingVertical: 8,
        paddingHorizontal: 10,
        marginVertical: 12,
        borderRadius: 5,
        elevation: 2, //for android only
        shadowColor: "black",
        shadowOffset: { width: 0, height: 0.2 },
        shadowOpacity: 0.1,
        shadowRadius: 1
    },
    input: {
        flex: 1,
        fontSize: 16,
    },
    iconContainer: {
        marginLeft: 8,
    },
});

export default PasswordInput;
