import React, { useEffect, useState } from 'react';
import PaymentWebView from './PaymentWebView';
import AsyncStorage from '@react-native-async-storage/async-storage';

const YourPaymentScreen = () => {
  const [midtransRedirectUrl, setMidtransRedirectUrl] = useState('');

  const fetchData = async () => {
    try {
      const token = await AsyncStorage.getItem('jwtToken');

      const response = await fetch('http://192.168.43.250:8080/api/v1/transaction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: '556f2024-f8ab-41e2-88c1-0c3871524661',
          price: 1,
          product: 'PRO',
        }),
      });

      const data = await response.json();
      setMidtransRedirectUrl(data.data.redirect_url);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return <PaymentWebView redirectUrl={midtransRedirectUrl} />;
};

export default YourPaymentScreen;
