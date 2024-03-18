import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import Button from '../../../components/Button';
import FlashMessage, { showMessage } from 'react-native-flash-message';
import { useNavigation,useRoute } from '@react-navigation/native';

const GenderRegisterScreen = () => {
  const navigation = useNavigation();
  const [gender, setGender] = useState('');
  const [loading, setLoading] = useState(false);
  const route = useRoute();
  const { full_name, user_id } = route.params; // Mendapatkan full_name dari parameter rute

  const handleRegister = async () => {
    try {
      setLoading(true);

      if (!gender) {
        showMessage({
          message: 'Validation Error',
          description: 'Please select a gender.',
          type: 'warning',
        });
        return;
      }

      // Navigate to the Home screen
      navigation.navigate('DOB', { full_name, gender, user_id });
    } catch (error) {
      showMessage({
        message: 'Registration failed',
        description: 'An unexpected error occurred.',
        type: 'danger',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Fetch any data needed for gender selection (if required)
    // Example: fetch('http://example.com/genders')
    //   .then(response => response.json())
    //   .then(data => console.log(data))
    //   .catch(error => console.error('Error fetching genders data:', error));
  }, []);

  const handleGenderSelect = (selectedGender) => {
    setGender(selectedGender);
  };

  return (
    <View style={styles.container}>
      {!loading && (
        <View style={styles.genderButtons}>
          <TouchableOpacity
            style={[
              styles.genderButton,
              gender === 'Men' && styles.selectedButton,
            ]}
            onPress={() => handleGenderSelect('Men')}
          >
            <Text style={{ color: gender === 'Men' ? '#fff' : '#000' }}>Men</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.genderButton,
              gender === 'Women' && styles.selectedButton,
            ]}
            onPress={() => handleGenderSelect('Women')}
          >
            <Text style={{ color: gender === 'Women' ? '#fff' : '#000' }}>Women</Text>
          </TouchableOpacity>
          {/* Add more gender buttons as needed */}
        </View>
      )}
      {!loading && <Button title="Next" onPress={handleRegister} disabled={!gender}/>}
      {loading && <ActivityIndicator size="large" color="#E92026" />}
      <FlashMessage position="top" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 20,
  },
  genderButtons: {
    flexDirection: 'column',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 40,
  },
  genderButton: {
    height: 50,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    marginBottom: 10,
  },
  selectedButton: {
    backgroundColor: '#E92026',
  },
});

export default GenderRegisterScreen;
