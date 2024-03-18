import React from 'react';
import { View, StyleSheet, FlatList, Dimensions } from 'react-native';

const SubscribeScreen = ({ navigation }) => {
  const data = [
    { id: '1', text: 'Item 1' },
    { id: '2', text: 'Item 2' },
    { id: '3', text: 'Item 3' },
    // Anda dapat menambahkan lebih banyak item sesuai kebutuhan
  ];

  const renderItem = ({ item }) => {
    return (
      <View style={styles.item}>
        {/* Konten untuk setiap item */}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.content}

      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
  },
  item: {
    width: Dimensions.get('window').width / 2.2, // Mengatur lebar setiap item
    height: 300, // Mengatur tinggi setiap item
    marginHorizontal: 5,
    borderRadius: 10,
    backgroundColor: '#ddd', // Atur warna sesuai kebutuhan Anda
    justifyContent: 'center',
    alignItems: 'center',
  },

});

export default SubscribeScreen;
