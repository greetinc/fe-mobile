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
    borderColor: '#ccc',
    marginBottom: 40,
    width:300,

  },
  input: {
    flex: 1,
    height: 40,
    width:30,
  },
  toggleButton: {
    padding: 10,
  },
});

export default InputField;
