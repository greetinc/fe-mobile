import React, { useState, useEffect, useRef } from 'react';
import {  View,  StyleSheet,  TextInput,  ScrollView,  TouchableOpacity,  Text,} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRoute } from '@react-navigation/native';
import axios from 'axios';
import uuid from 'react-native-uuid';
import ChatHeader from './ChatHeader';

const ChatScreen = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const scrollViewRef = useRef();
  const socketRef = useRef(null);
  const [userId, setUserId] = useState(null);
  const route = useRoute();
  const { friendId, friendName } = route.params; // Mendapatkan friendId dan friendName dari route params

  const scrollToBottom = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  };

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const id = await AsyncStorage.getItem('userId');
        if (id) {
          setUserId(id);
        } else {
          console.warn('UserId not found in AsyncStorage');
        }
      } catch (error) {
        console.error('Error fetching userId:', error);
      }
    };

    fetchUserId();
  }, []);

  useEffect(() => {
    const setupSocket = async () => {
      try {
        const socket = new WebSocket('ws://192.168.43.250:8080/ws');
  
        socket.onopen = () => {
          console.log('WebSocket Connected');
        };
  
        socket.onerror = (error) => {
          console.error('WebSocket Error:', error);
        };
  
        socket.onmessage = (event) => {
          const data = JSON.parse(event.data);
  
          if (!data.id) {
            data.id = uuid.v4();
          }
  
          if (data.sender_id !== 'server' && data.sender_id !== userId) {
            setMessages((prevMessages) => [
              ...prevMessages,
              { content: data.content, sender_id: 'server' },
            ]);
            scrollToBottom();
          }
        };
  
        socket.onclose = (event) => {
          console.log('WebSocket Closed:', event);
        };
  
        socketRef.current = socket;
  
        fetchChatHistory(); // Panggil fetchChatHistory setelah setup socket selesai
      } catch (error) {
        console.error('Error setting up WebSocket:', error);
      }
    };
  
    setupSocket();
  
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [userId]);
  
  

  const sendMessage = () => {
    if (message.trim() && friendId && userId && socketRef.current) {
      const messageData = {
        id: uuid.v4(),
        receiver_id: friendId,
        content: message,
        sender_id: userId,
      };

      setMessages((prevMessages) => [
        ...prevMessages,
        {
          ...messageData,
          receiver_id: userId,
          sender: friendId,
        },
      ]);
      socketRef.current.send(JSON.stringify(messageData));
      scrollToBottom(); // Auto-scroll to bottom after sending a message
      setMessage('');
    }
  };

  const fetchChatHistory = async () => {
    try {
      console.log('Before fetching chat history...');
      const response = await axios.get(`http://192.168.43.250:8080/history`, {
        params: {
          sender_id: userId,
          receiver_id: friendId,
        },
      });
      console.log('Chat history response:', response.data);
      if (response.data !== null) { // Periksa apakah respons tidak null
        setMessages(response.data);
        scrollToBottom();
      } else {
        // Menampilkan pesan bahwa tidak ada riwayat obrolan yang ditemukan
        setMessages([]);
      }
    } catch (error) {
      console.error('Error fetching chat history:', error);
      // Tampilkan pesan kesalahan kepada pengguna
      alert('Error fetching chat history. Please try again later.');
    }
  };
  
  

  const renderMessages = () => {
    return Array.isArray(messages) && messages.length > 0 ? (
      messages.map(({ id, content, sender_id }) => (
        <View
          key={id}
          style={[
            styles.message,
            sender_id === userId ? styles.sentMessage : styles.receivedMessage,
            sender_id === userId ? styles.alignRight : styles.alignLeft,
          ]}
        >
          <Text>{content}</Text>
        </View>
      ))
    ) : (
      <Text style={styles.noMessageText}>Tidak ada pesan</Text>
    );
  };

  return (
    <View style={styles.container}>
      <ChatHeader friend={friendName} />

      <ScrollView ref={scrollViewRef}>{renderMessages()}</ScrollView> 
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          value={message}
          onChangeText={(text) => setMessage(text)}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Icon name="send" size={24} color="#007bff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  message: {
    backgroundColor: '#e5e5e5',
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
    maxWidth: '80%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    height: 40,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#f1f1f1',
    borderRadius: 50,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  sentMessage: {
    backgroundColor: '#dcf8c6', // Warna hijau muda untuk pesan pengirim
  },
  receivedMessage: {
    backgroundColor: '#f3f3f3', // Warna abu-abu untuk pesan penerima
  },
  alignRight: {
    alignSelf: 'flex-end', // Mengatur pesan pengirim ke sisi kanan
  },
  alignLeft: {
    alignSelf: 'flex-start', // Mengatur pesan penerima ke sisi kiri
  },
  noMessageText: {
    alignSelf: 'center',
    marginTop: 20,
  },
});

export default ChatScreen;
