import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Platform,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';

const ProfileScreen = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [selectedOption, setSelectedOption] = useState('Option 1');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const getTokenFromStorage = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('jwtToken');
        console.log('Retrieved token:', storedToken);
        if (storedToken) {
          await fetchData(storedToken);
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error('Error getting token from storage:', error);
        setLoading(false);
      }
    };

    getTokenFromStorage();
  }, []);

  const fetchData = async (token) => {
    try {
      const response = await fetch('http://10.0.2.2:8080/api/v1/profile', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      console.log('API Response:', data);
      setProfileData(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const handleLogout = () => {
    console.log('Logout button pressed');
  };

  const onDateChange = (event, date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    setSelectedDate(date || selectedDate);
  };

  const showDatePickerComponent = () => {
    setShowDatePicker(true);
  };

  const renderDropdownOptions = () => {
    return [
      'Izin Sakit (Medical Leave)',
      'Izin Cuti Tahunan (Annual Leave/Vacation Leave)',
      'Izin Kegawatdaruratan (Emergency Leave)',
      'Izin Pribadi (Personal Leave)',
      'Izin Melahirkan (Maternity/Paternity Leave)',
      'Izin Menikah (Marriage Leave)',
      'Izin Berduka (Bereavement Leave)',
      'Izin Pendidikan (Educational Leave)',
      'Izin Haji (Hajj Leave)',
      'Izin Tugas Resmi (Official Duty Leave)',
    ].map((option) => (
      <Picker.Item key={option} label={option} value={option} />
    ));
  };

  const handleSubmit = async () => {
    if (!selectedOption || !selectedDate || !additionalInfo) {
      Alert.alert('Validation Error', 'Please fill in all fields.');
      return;
    }

    setSubmitting(true);

    try {
      const token = await AsyncStorage.getItem('jwtToken');
      const response = await fetch('http://10.0.2.2:8080/api/v1/submit-permit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          option: selectedOption,
          date: selectedDate.toISOString(),
          additionalInfo,
        }),
      });

      if (response.ok) {
        Alert.alert('Permit Submitted', 'Your permit application has been submitted successfully.');
      } else {
        Alert.alert('Submission Failed', 'Failed to submit permit application. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting permit:', error);
      Alert.alert('Submission Error', 'An error occurred while submitting the permit application.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <View style={styles.profileContainer}>
          {/* Personal Information */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Personal Information</Text>
            <View style={styles.formField}>
              <Text style={styles.label}>Full Name:</Text>
              <Text style={styles.value}>{profileData?.data?.full_name || 'N/A'}</Text>
            </View>
            <View style={styles.formField}>
              <Text style={styles.label}>Email:</Text>
              <Text style={styles.value}>{profileData?.data?.email || 'N/A'}</Text>
            </View>
            <View style={styles.formField}>
              <Text style={styles.label}>Company:</Text>
              <Text style={styles.value}>{profileData?.data?.company_name || 'N/A'}</Text>
            </View>
            <View style={styles.formField}>
              <Text style={styles.label}>Whatsapp:</Text>
              <Text style={styles.value}>{profileData?.data?.whatsapp || 'N/A'}</Text>
            </View>
          </View>

          <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Permit application</Text>
              <View style={styles.formField}>
                <Text style={styles.label}>Options:</Text>
                <Picker
                  style={styles.dropdown}
                  selectedValue={selectedOption}
                  onValueChange={(itemValue) => setSelectedOption(itemValue)}
                >
                  {renderDropdownOptions()}
                </Picker>
              </View>
              <View style={styles.formField}>
                <Text style={styles.label}>Additional Field:</Text>
                <TouchableOpacity onPress={showDatePickerComponent}>
                  <Text style={styles.input}>{selectedDate.toDateString()}</Text>
                </TouchableOpacity>
                {showDatePicker && (
                  <DateTimePicker
                    mode="date"
                    value={selectedDate}
                    onChange={onDateChange}
                    display="default"
                  />
                )}
              </View>
              <View style={styles.formField}>
                <Text style={styles.label}>Desc:</Text>
                <TextInput
                  style={[styles.input, styles.textarea]}
                  multiline
                  numberOfLines={4}
                  placeholder="Enter additional information"
                  value={additionalInfo}
                  onChangeText={(text) => setAdditionalInfo(text)}
                />
              </View>
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              style={styles.button}
              onPress={handleSubmit}
              disabled={submitting}
            >
              {submitting ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <Text style={styles.buttonText}>Submit Permit</Text>
              )}
            </TouchableOpacity>
          </View>
        )}
        <TouchableOpacity style={styles.button} onPress={handleLogout}>
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    marginTop: 20, // Add marginTop to create space at the top
    marginBottom: 20, // Add marginTop to create space at the top

  },
  profileContainer: {
    width: '90%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    marginBottom: 20,
  },
  sectionContainer: {
    width: '100%',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  formField: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: '#ffffff',
    padding: 10,
    borderRadius: 5,
  },
  label: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
  },
  input: {
    flex: 2,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingLeft: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
  dropdown: {
    flex: 2,
    height: 40,
    marginLeft: 10,
  },
  textarea: {
    height: 100,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#3498db',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProfileScreen;
