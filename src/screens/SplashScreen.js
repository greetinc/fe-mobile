import React, { useEffect } from 'react';
import { View, Image, StyleSheet, Text } from 'react-native';

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    const timeout = setTimeout(() => {
      navigation.replace('Index');
    }, 3500);

    return () => clearTimeout(timeout);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        {/* Ganti require('path_to_your_logo.png') dengan path ke file PNG logo Anda */}
        <Image source={require('../assets/images/logo.png')} style={styles.logo} />
      </View>
      <Text style={styles.versionText}>V.0.0.1</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end', // Menggeser ke bagian bawah
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingBottom: 40, // Sesuaikan jarak dari bawah sesuai kebutuhan
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  logo: {
    width: 200, // Sesuaikan ukuran gambar sesuai kebutuhan
    height: 200,
  },
  versionText: {
    fontSize: 12,
    color: '#333', // Sesuaikan warna teks sesuai kebutuhan
    marginBottom: 20, // Sesuaikan jarak dari bawah sesuai kebutuhan
  },
});

export default SplashScreen;
