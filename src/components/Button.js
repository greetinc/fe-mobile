import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

// const Button = ({ title, onPress }) => {
//   return (
//     <TouchableOpacity style={styles.button} onPress={onPress}>
//       <Text style={styles.buttonText}>{title}</Text>
//     </TouchableOpacity>
//   );
// };

const Button = ({ title, onPress, disabled }) => {
  return (
    <TouchableOpacity
      style={[styles.button, disabled && styles.disabledButton]}
      onPress={!disabled ? onPress : null}
      disabled={disabled}
    >
      <Text style={[styles.buttonText, disabled && styles.disabledButtonText]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#fff',
    borderColor: '#E92026',
    borderWidth: 1,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    alignSelf: 'center',
    marginVertical: 10,
    width: width * 0.75,
  },
  buttonText: {
    color: '#E92026',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#ccc', // Set a different color for disabled state
    borderColor: '#ccc',
  },
  disabledButtonText: {
    color: '#888', // Set a different color for disabled state
  },
});

export default Button;
