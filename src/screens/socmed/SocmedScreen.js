import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Button, FlatList, Image, TouchableOpacity, Modal, ScrollView, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Footer from '../../components/Footer.js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SocMedScreen = () => {
    const navigation = useNavigation();
    const windowWidth = Dimensions.get('window').width;
    const [posts, setPosts] = useState([]);
    const [newPostText, setNewPostText] = useState('');
    const [newPostImage, setNewPostImage] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const token = await AsyncStorage.getItem('jwtToken');
            const response = await fetch('http://192.168.43.250:8080/api/v1/blog?limit=10',{
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
            });
            const data = await response.json();
            console.log('Data from API:', data); 

            setPosts(data.data); 
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    };

    const handleAddPost = async () => {
        try {
            const token = await AsyncStorage.getItem('jwtToken');
            const response = await fetch('http://192.168.43.250:8080/api/v1/blog', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    title: 'Your Post Title',
                    content: newPostText,
                    // Add other necessary fields here
                }),
            });
            if (response.ok) {
                const data = await response.json();
                console.log('New post created:', data);
                // Refresh posts after creating a new post
                fetchPosts();
                // Close the modal after successfully adding a new post
                setIsModalVisible(false);
            } else {
                console.error('Failed to create post:', response.statusText);
            }
        } catch (error) {
            console.error('Error creating post:', error);
        }
    };
    
    

    const handleLikePost = (id) => {
        setPosts(currentPosts =>
            currentPosts.map(post =>
                post.id === id ? { ...post, likes: post.likes + 1 } : post
            )
        );
    };

    const handleAddComment = (id, comment) => {
        setPosts(currentPosts =>
            currentPosts.map(post =>
                post.id === id ? { ...post, comments: [...post.comments, comment] } : post
            )
        );
    };
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText} onPress={() => navigation.navigate('Subscribe')}>Let's go to premium user</Text>
            </View>
            <TouchableOpacity style={styles.inputContainer} onPress={() => setIsModalVisible(true)}>
                <Text style={styles.inputLabel}>What's on your mind?</Text>
            </TouchableOpacity>
            <Modal
                visible={isModalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setIsModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <View style={styles.inputWrapper}>
                            <View style={styles.buttonRow}>
                                <TouchableOpacity style={styles.addButton} onPress={() => console.log('Add button pressed')}>
                                    <Icon name="photo" size={24} color="#007bff" />
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.sendButton, (!newPostText || newPostText.length < 1 || newPostText.length > 5000) && styles.disabled]} onPress={handleAddPost} disabled={!newPostText || newPostText.length < 1 || newPostText.length > 5000}>
                                    <Icon name="send" size={24} color={newPostText ? "#007bff" : "#c7c7c7"} />
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.cancelButton} onPress={() => setIsModalVisible(false)}>
                                    <Icon name="close" size={24} color="#007bff" />
                                </TouchableOpacity>
                            </View>
                            <View style={styles.inputRow}>
                                <TextInput
                                    style={[styles.input, { height: windowWidth * 0.85 }]} // Adjust height based on window width
                                    placeholder="Type your post here"
                                    value={newPostText}
                                    onChangeText={setNewPostText}
                                    multiline={true}
                                    textAlignVertical="top"
                                    maxLength={5000} // Set maximum length
                                />
                            </View>
                            <Text style={styles.characterCount}>{newPostText.length}/5000</Text>
                        </View>
                    </View>
                </View>
            </Modal>
            <FlatList
                data={posts}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <View style={styles.postContainer}>
                        <View style={styles.post}>
                            <Text style={styles.postCreatedBy}>{item.created_by}</Text>
                            <Text style={styles.postText}>{item.content}</Text>
                            {item.image ? (
                                <Image source={{ uri: item.image }} style={styles.postImage} />
                            ) : null}
                            <View style={styles.postActions}>
                                <TouchableOpacity onPress={() => handleLikePost(item.id)}>
                                    <Text><Icon name="favorite" size={20} color="#E72929" />{item.likes}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => handleAddComment(item.id, "Nice post!")}>
                                    <Text><Icon name="chat-bubble" size={20} color="#ccc" /></Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                )}
            />
            <Footer />
        </View>
    );    
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 7,
    },
    postContainer: {
        marginVertical: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 3,
        marginBottom: 1,
    },
    header: {
        backgroundColor: '#DFF5FF',
        padding: 10,
        marginBottom: 7,
        borderRadius: 10,
    },
    headerText: {
        fontSize: 10,
        fontWeight: 'bold',
    },
    inputContainer: {
        marginBottom: 7,
    },
    inputLabel: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 10,
        borderRadius: 5,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        height: 420,
    },
    inputWrapper: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        flex: 1,
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    characterCount: {
        alignSelf: 'flex-end',
        marginRight: 10,
        color: 'grey'
    },
    buttonRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    sendButton: {
        borderRadius: 50,
        paddingHorizontal: 15,
        paddingVertical: 10,
    },
    addButton: {
        borderRadius: 50,
        paddingHorizontal: 15,
        paddingVertical: 10,
        marginRight: 10,
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 10,
        borderRadius: 5,
    },
    cancelButton: {
        position: 'absolute',
        bottom: 20,
        left: 5,
    },
    postText: {
        marginBottom: 10,
        padding: 10,
    },
    postCreatedBy: {
        marginBottom: 0,
        padding: 10,
        fontWeight: 'bold',
    },
    postImage: {
        width: '100%',
        height: 200,
        marginBottom: 10,
    },
    postActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
        padding: 10,
    },
    comment: {
        marginTop: 5,
    },
});

export default SocMedScreen
