import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const InputField = ({ placeholder, onChangeText, secureTextEntry, isPasswordVisible, togglePasswordVisibility }) => {
  return (
    <View style={styles.inputContainer}>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry && !isPasswordVisible}
      />
      {secureTextEntry && (
        <TouchableOpacity onPress={togglePasswordVisibility} style={styles.toggleButton}>
          {/* Use 'md-eye' and 'md-eye-off' for Ionicons in Material Design style */}
          <Ionicons name={isPasswordVisible ? 'eye-off' : 'eye'} size={24} color="black" />

        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: 'black',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    height: 40,
  },
  toggleButton: {
    padding: 10,
  },
});

export default InputField;
