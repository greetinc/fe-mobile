import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Button from '../components/Button';

const IndexScreen = ({ navigation }) => {
  // Fungsi untuk menangani aksi setelah tombol Google Login ditekan
  const handleGoogleLogin = () => {
    // Implementasikan logika login dengan Google di sini
    console.log('Google Login Pressed');
    // Misalnya, arahkan ke halaman login Google
    // navigation.navigate('GoogleLogin');
  };

  // Fungsi untuk menangani aksi setelah tombol Register ditekan
  const handleRegister = () => {
    // Implementasikan logika pindah ke halaman Register di sini
    console.log('Register Pressed');
    // Misalnya, arahkan ke halaman Register
    // navigation.navigate('Register');
  };

  return (
    <View style={styles.container}>
      {/* Konten lainnya */}
      <Image source={require('../assets/images/logo.png')} style={styles.logo} />

      {/* Tombol Google Login */}
      {/* <TouchableOpacity style={styles.googleButton} onPress={handleGoogleLogin}>
        <Image source={require('../assets/images/logo_google.png')} style={styles.googleLogo} />
        <Text style={styles.googleButtonText}>Login with Google</Text>
      </TouchableOpacity>
       */}

      {/* Tombol Register */}
      {/* <Button title="Masuk" onPress={() => navigation.navigate('Login')} /> */}
      <TouchableOpacity
        style={[styles.loginButton, { backgroundColor: '#fff' }]}
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.registerButton, { backgroundColor: '#E92026' }]}
        onPress={() => navigation.navigate('Register')}
      >
        <Text style={styles.registerButtonText}>Register</Text>
      </TouchableOpacity>
{/* 
      <TouchableOpacity style={styles.registerButton} onPress={() => navigation.navigate('Login')}>
        <Text style={styles.attext}>@  </Text>
        <Button>Login with Email
      </TouchableOpacity> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 200, // Sesuaikan ukuran gambar sesuai kebutuhan
    height: 200,
    marginBottom: 220,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff', // Warna biru Google
    paddingHorizontal: 60,
    paddingVertical: 15,
    borderRadius: 8,
    marginTop: 20,
    borderColor: '#E92026',
    borderWidth: 1, // Lebar border
    width: '80%',
    marginVertical: 10,
  },
  // googleButton: {
  //   backgroundColor: '#fff',
  //   borderColor: '#E92026',
  //   borderWidth: 1,
  //   padding: 15,
  //   borderRadius: 8,
  //   alignItems: 'center',
  //   marginVertical: 10,
  //   width: '80%',
  // },
  googleLogo: {
    width: 24, // Sesuaikan ukuran logo sesuai kebutuhan
    height: 24,
    marginRight: 10,
  },
  googleButtonText: {
    color: '#4285F4', // Warna teks putih
    fontWeight: 'bold',
    fontSize: 17,
  },
  loginButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#E92026',
    borderRadius: 8,
    alignItems: 'center',
    width: '80%',
    height: '7%',
    borderColor:'#E92026',
    borderWidth:1,
  },
  loginButtonText: {
    color: '#E92026', // Sesuaikan warna teks sesuai kebutuhan
    fontWeight: 'bold',
    fontSize: 17,
  },
  registerButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#E92026',
    borderRadius: 8,
    alignItems: 'center',
    width: '80%',
    height: '7%',
  },
  registerButtonText: {
    color: '#fff', // Sesuaikan warna teks sesuai kebutuhan
    fontWeight: 'bold',
    fontSize: 17,
  },
  attext: {
    color: '#000', // Sesuaikan warna teks sesuai kebutuhan
    fontWeight: 'bold',
    fontSize: 17,
  },
});

export default IndexScreen;
