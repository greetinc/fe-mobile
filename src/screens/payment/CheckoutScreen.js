import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Switch } from 'react-native';

const CheckoutScreen = ({ route, navigation }) => {
  const { boostItem } = route.params;
  const [isDollar, setIsDollar] = useState(true);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
  });

  const onInputChange = (field, value) => {
    setFormData((prevData) => ({ ...prevData, [field]: value }));
  };

  const handleCheckout = () => {
    // Implement your checkout logic here

    // Assuming you want to navigate to YourPaymentScreen after checkout
    navigation.navigate('PaymentScreen');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.formTitle}>Checkout</Text>

        {/* Formulir */}
        <View style={styles.inputContainer}>
          <View style={styles.labelValueContainer}>
            <Text style={styles.label}>Product:</Text>
            <Text style={styles.value}>{boostItem.name}</Text>
          </View>
        </View>
        <View style={styles.inputContainer}>
          <View style={styles.labelValueContainer}>
            <Text style={styles.label}>Price:</Text>
            <Text style={styles.value}>{boostItem.price}</Text>
          </View>
        </View>
         {/* Switch Button for Currency */}
       <View style={styles.switchContainer}>
          <Text style={styles.label}>Price:</Text>
          <Switch
            value={isDollar}
            onValueChange={(value) => setIsDollar(value)}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={isDollar ? '#f5dd4b' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
          />
          <Text style={styles.switchLabel}>{isDollar ? 'USD' : 'IDR'}</Text>
          <View style={styles.currencyContainer}>
              {isDollar ? (
                <Text style={styles.currencySymbol}>🇺🇸</Text>
              ) : (
                <Text style={styles.currencySymbol}>🇮🇩</Text>
              )}
              <Text style={styles.value}>{boostItem.price}</Text>
            </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Address:</Text>
          <TextInput
            style={styles.input}
            onChangeText={(text) => onInputChange('address', text)}
            placeholder="Enter your address"
            multiline
          />
        </View>

      
           {/* Tombol Checkout */}
        <View style={styles.buttonContainer}>
          <Button title="Checkout" onPress={handleCheckout} />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  formContainer: {
    padding: 20,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  inputContainer: {
    marginBottom: 15,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
  },
  buttonContainer: {
    marginTop: 20,
  },
  labelValueContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  value: {
    fontSize: 16,
  },
  currencyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currencySymbol: {
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 5,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },

});

export default CheckoutScreen;
