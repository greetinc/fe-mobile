import React, { useState, useEffect } from 'react';
import { View,TouchableHighlight, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Platform, TextInput, ScrollView, Alert, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import MultiSlider from '@ptomasroos/react-native-multi-slider'; // Import MultiSlider
import Slider from '@react-native-community/slider'; // Import Slider

const SettingScreen = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [selectedOption, setSelectedOption] = useState('Option 1');
  const [submitting, setSubmitting] = useState(false);
  const [selectedAge, setSelectedAge] = useState([16, 55]); // Set an initial age range
  const [sliderValue, setSliderValue] = useState(50); // State untuk slider range
  const [isModalVisible, setModalVisible] = useState(false);
  const [editedFullName, setEditedFullName] = useState('');

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
    setEditedFullName(profileData?.data?.full_name || ''); // Reset editedFullName saat membuka modal
  };

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
      const response = await fetch('http://192.168.43.250:8080/api/v1/profile', {
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
      'Men',
      'Women',
      
    ].map((option) => (
      <Picker.Item key={option} label={option} value={option} />
    ));
  };

  const handleSave = async () => {
    try {
      const token = await AsyncStorage.getItem('jwtToken');
      const response = await fetch(`http://192.168.43.250:8080/api/v1/profile/${profileData?.data?.id}`, {
        method: 'PUT', // Gunakan metode PUT untuk mengubah data
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          full_name: editedFullName,
          description: profileData?.data?.description || '', // Sesuaikan dengan key yang digunakan di API
        }),
      });

      if (response.ok) {
        Alert.alert('Profile Updated', 'Your profile has been updated successfully.');
        toggleModal();
        // Ambil data terbaru setelah perubahan
        await fetchData(token);
      } else {
        Alert.alert('Update Failed', 'Failed to update profile. Please try again.');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Update Error', 'An error occurred while updating the profile.');
    }
  };

  const handleAgeRangeSubmit = async () => {
    try {
      const token = await AsyncStorage.getItem('jwtToken');
      const response = await fetch(`http://192.168.43.250:8080/api/v1/age/${profileData?.data?.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          max_age: selectedAge[1],
          min_age: selectedAge[0],
        }),
      });
  
      if (response.ok) {
        console.log('Age range updated successfully');
      } else {
        console.error('Failed to update age range');
      }
    } catch (error) {
      console.error('Error updating age range:', error);
    }
  };

  const handleRadiusSubmit = async () => {
    try {
      const token = await AsyncStorage.getItem('jwtToken');
      const response = await fetch('URL_API_RADIUS', {  // Gantilah 'URL_API_RADIUS' sesuai dengan URL yang benar untuk mengedit radius
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          radius: sliderValue,
        }),
      });
  
      if (response.ok) {
        console.log('Radius updated successfully');
      } else {
        console.error('Failed to update radius');
      }
    } catch (error) {
      console.error('Error updating radius:', error);
    }
  };

  const handleSubmit = async () => {
     
    setSubmitting(true);
  
    try {
      // Kirim permintaan untuk mengubah rentang usia dan radius
      await handleAgeRangeSubmit();
  
      // Kirim permintaan untuk mengubah data profil lainnya
    } catch (error) {
      console.error('Error submitting permit:', error);
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
            <View style={styles.formField}>
              <Text style={styles.label}>Full Name:</Text>
              <TouchableOpacity onPress={toggleModal}>
              <Text style={styles.value}>{profileData?.data?.full_name || 'N/A'}</Text>
              </TouchableOpacity>
            </View>

                {/* Modal */}
                <Modal
    animationType="slide"
    transparent={true}
    visible={isModalVisible}
    onRequestClose={() => {
      Alert.alert('Modal has been closed.');
      toggleModal();
    }}>
    <View style={styles.modalContainer}>
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>Edit Full Name</Text>
        <TextInput
          style={styles.modalInput}
          placeholder="Enter new full name"
          value={profileData?.data?.full_name}
          onChangeText={(text) => setEditedFullName(text)}
        />
       <TouchableHighlight
            style={styles.modalButton}
            onPress={handleSave} // Mengubah onPress
            >
            <Text style={styles.modalButtonText}>Save</Text>
          </TouchableHighlight>
        <TouchableHighlight
            style={[styles.modalButton, { backgroundColor: '#e74c3c' }]}
            onPress={toggleModal}>
            <Text style={styles.modalButtonText}>Cancel</Text>
          </TouchableHighlight>
      </View>
    </View>
  </Modal>

            <View style={styles.formField}>
              <Text style={styles.label}>Email:</Text>
              <Text style={styles.value}>{profileData?.data?.email || 'N/A'}</Text>
            </View>
            <View style={styles.formField}>
              <Text style={styles.label}>Age:</Text>
              <Text style={styles.value}>{profileData?.data?.age || 'N/A'}</Text>
            </View>
            <View style={styles.formField}>
                <Text style={styles.label}>Birthday:</Text>
                <TouchableOpacity onPress={showDatePickerComponent}>
                  <Text>{selectedDate.toDateString()}</Text>
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
                <Text style={styles.label}>Gender:</Text>
                <Picker
                  style={styles.dropdown}
                  selectedValue={selectedOption}
                  onValueChange={(itemValue) => setSelectedOption(itemValue)}
                >
                  {renderDropdownOptions()}
                </Picker>
              </View>
              <View style={styles.formField}>
                <Text style={styles.label}>Desc:</Text>
                <TextInput
                  style={[styles.input, styles.textarea, profileData?.data?.description || 'N/A']}
                  multiline
                  numberOfLines={4}
                  placeholder="Enter additional information"
                  value={additionalInfo}
                  onChangeText={(text) => setAdditionalInfo(text)}
                />
              </View>
            <View style={styles.formField}>
              <Text style={styles.label}>Age Range:</Text>
              <MultiSlider
                values={selectedAge}
                sliderLength={200}
                min={16}
                max={55}
                step={1}
                onValuesChange={(values) => setSelectedAge(values)}
                allowOverlap
                snapped
              />
            </View>
            <View style={styles.sliderRangeTextContainer}>
              <Text style={styles.sliderRangeText}>{`${selectedAge[0]} - ${selectedAge[1]}`}</Text>
            </View>
            <View style={styles.formField}>
              <Text style={styles.label}>Radius:</Text>
              <Slider
                style={styles.slider}
                minimumValue={5}
                maximumValue={80}
                step={1}
                value={sliderValue}
                onValueChange={(value) => setSliderValue(value)}
              />
            </View>
            <View style={styles.sliderRangeTextContainer}>
            <Text style={styles.sliderValueText}>{`${sliderValue} km`}</Text>
            </View>       
          </View>
          <View style={styles.sectionContainer}>
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
                  <Text style={styles.buttonText}>Done</Text>
                )}
              </TouchableOpacity>
          </View>
        )}
      
      </View>
    </ScrollView>
  );
};


const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalInput: {
    height: 60,
    width: 250,
    borderRadius: 10,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  modalButton: {
    backgroundColor: '#3498db',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    marginTop: 20, // Add marginTop to create space at the top
    marginBottom: 20, // Add marginTop to create space at the top
  },
  sliderRangeTextContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  sliderRangeText: {
    fontSize: 15,
    marginTop: -60, // Sesuaikan nilai ini untuk mengatur jarak dari garis slider
    marginLeft: 90, // Sesuaikan nilai ini untuk mengatur jarak dari garis slider
  },
  slider: {
    flex: 2,
    marginLeft: 0,
    marginRight: 0,
  },
  sliderValueText: {
    fontSize: 14,
    marginLeft: 90,
    marginTop: -30,
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
    flex: 1,
    height: 30,
    marginLeft: 10,
  },
  textarea: {
    height: 100,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
    borderColor: '#000',
    borderWidth: 1,
    },
  buttonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SettingScreen;
