import React from 'react';
import { WebView } from 'react-native-webview';

const PaymentWebView = ({ redirectUrl }) => {
  return (
    <WebView
      source={{ uri: redirectUrl }}
      javaScriptEnabled={true}
      domStorageEnabled={true}
    />
  );
};

export default PaymentWebView;
