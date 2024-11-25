import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { api } from '../api';
import { Box, VStack, Text, Heading, IconButton } from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';

const NotificationPopup = () => {
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState('');
  const mobilenumber = sessionStorage.getItem('mobilenumber');

  useEffect(() => {
    if (mobilenumber) {
      fetchMessages();
    }
  }, [mobilenumber]);

  const fetchMessages = async () => {
    try {
      const response = await axios.get(`${api}/user/${mobilenumber}/messages`);
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
      setError('Could not load messages.');
    }
  };

  const addMessage = async (newMessage) => {
    try {
      const response = await axios.post(`${api}/user/${mobilenumber}/messages`, { message: newMessage });
      setMessages((prevMessages) => [...prevMessages, response.data]);
    } catch (error) {
      console.error('Error adding message:', error);
      setError('Could not add message.');
    }
  };

  const deleteMessage = async (id) => {
    try {
      await axios.delete(`${api}/user/${mobilenumber}/messages/${id}`);
      setMessages((prevMessages) => prevMessages.filter((msg) => msg._id !== id));
    } catch (error) {
      console.error('Error deleting message:', error);
      setError('Could not delete message.');
    }
  };

  return (
    <Box
      maxW="sm"
      mx="auto"
      mt={5}
      p={4}
      bg="white"
      borderRadius="lg"
      boxShadow="lg"
      border="1px solid"
      borderColor="gray.300"
    >
      <Heading as="h2" size="lg" mb={4} textAlign="center">
        Notifications
      </Heading>
      <VStack spacing={3} align="start">
        {error && <Text color="red.500">{error}</Text>}
        {messages.map((msg) => (
          <Box
            key={msg._id}
            bg="gray.100"
            p={3}
            borderRadius="md"
            w="100%"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Text>{msg.message}</Text>
            <IconButton
              size="sm"
              icon={<CloseIcon />}
              onClick={() => deleteMessage(msg._id)}
              aria-label="Delete message"
              colorScheme="red"
            />
          </Box>
        ))}
        {messages.length === 0 && <Text>No new notifications.</Text>}
      </VStack>
    </Box>
  );
};

export default NotificationPopup;
