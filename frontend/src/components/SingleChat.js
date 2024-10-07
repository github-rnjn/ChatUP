import React, { useEffect, useState, useRef } from 'react';
import { ChatState } from '../contexts/ChatProvider';
import { Box, FormControl, IconButton, Input, Spinner, Text, useToast } from '@chakra-ui/react';
import { IoMdArrowRoundBack } from 'react-icons/io';
import { getSender, getSenderFull } from '../config/ChatLogics';
import ProfileModal from './ProfileModal';
import UpdateGroupChatModal from './UpdateGroupChatModal';
import axios from 'axios';
import "../styles.css";
import ScrollableChat from './ScrollableChat';
import io from 'socket.io-client';
import Lottie from 'react-lottie';
import animationData from '../animations/typing.json';

const ENDPOINT = "http://localhost:5000";
let socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const { user, selectedChat, setSelectedChat, notification, setNotification } = ChatState();
  const [socketConnected, setSocketConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typingMessage, setTypingMessage] = useState("");
  const toast = useToast();

  const typingTimeoutRef = useRef(null);

  const fetchMessages = async () => {
    if (!selectedChat) return;
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      setLoading(true);
      const { data } = await axios.get(`/api/message/${selectedChat._id}`, config);
      setMessages(data);
      setLoading(false);
      socket.emit('join chat', selectedChat._id);
    } catch (error) {
      toast({
        title: "Error Occurred",
        description: "Failed to load the Messages",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };
  useEffect(() => {
    socket = io(ENDPOINT, { transports: ["websocket"] });

    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", ({ message }) => {
      setTypingMessage(message);
      setIsTyping(true);
    });
    socket.on("stop typing", () => {
      setTypingMessage("");
      setIsTyping(false);
    });

    return () => {
      socket.disconnect();
    };
  }, [user]);
  

  useEffect(() => {
    fetchMessages();
    if (selectedChat) {
      // Clear notifications for the selected chat
      setNotification(notification.filter(msg => msg.chat._id !== selectedChat._id));
    }
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    const handleMessageReceived = (newMessageReceived) => {
      if (!selectedChatCompare || selectedChatCompare._id !== newMessageReceived.chat._id) {
        if (!notification.includes(newMessageReceived)) {
          setNotification([newMessageReceived, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages((prevMessages) => [...prevMessages, newMessageReceived]);
      }
    };

    socket.on('message received', handleMessageReceived);

    return () => {
      socket.off('message received', handleMessageReceived);
    };
  }, [selectedChatCompare, fetchAgain, notification, setNotification, setFetchAgain]);

  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage) {
      socket.emit('stop typing', { room: selectedChat._id });
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        setNewMessage("");
        const { data } = await axios.post("/api/message", {
          content: newMessage,
          chatId: selectedChat._id,
        }, config);
        socket.emit('new message', data);
        setMessages((prevMessages) => [...prevMessages, data]);
      } catch (error) {
        toast({
          title: "Error Occurred",
          description: "Failed to send Message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };

  const typingHandler = (e) => {
    setNewMessage(e.target.value);
  
    if (!socketConnected) return;
  
    // Option A: Using a timer directly in the handler
    let lastTypingTime = new Date().getTime();
    const timerLength = 3000;
  
    setTimeout(() => {
      const timeNow = new Date().getTime();
      const timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && isTyping) {
        socket.emit("stop typing", selectedChat._id);
        setIsTyping(false);
      }
    }, timerLength);
  
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
  
    if (!isTyping) {
      setIsTyping(true);
      socket.emit("typing", { room: selectedChat._id, message: `${user.name} is typing...` });
    }
  
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      socket.emit('stop typing', { room: selectedChat._id });
    }, 3000);
  };
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);
  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="Work sans"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<IoMdArrowRoundBack height={28} width={28} />}
              onClick={() => setSelectedChat("")}
            />
            {!selectedChat.isGroupChat ? (
              <>
                {<h1 style={{fontWeight:"bold"}}>{getSender(user, selectedChat.users)}</h1>}
                <ProfileModal user={getSenderFull(user, selectedChat.users)} />
              </>
            ) : (
              <>
                {selectedChat.chatName.toUpperCase()}
                <UpdateGroupChatModal
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  fetchMessages={fetchMessages}
                />
              </>
            )}
          </Text>
            {/* Chat Region  */}
          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="#E8E8E8"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
            backgroundColor="#2F3645"
          >
            {loading ? (
              <Spinner size="xl" w={20} h={20} alignSelf="center" margin="auto" />
            ) : (
              <div className='messages'>
                {/* Chat will be shown here  */}
                <ScrollableChat messages={messages} />
              </div>
            )}
            {/* Chat Sending Region  */}
            <FormControl onKeyDown={sendMessage} isRequired mt={3}>
              {isTyping && typingMessage && (
                <div>
                  {/* This will be shown when any of the user is writing into the chatbox  */}
                  <Lottie
                  options={{
                    loop: true,
                    autoplay: true,
                    animationData: animationData,
                    rendererSettings: {
                      preserveAspectRatio: "xMidYMid slice",
                    },
                  }}
                  style={{ marginBottom: 15, marginLeft: 0 ,width:70}}
                />
                </div>
              )}
              {/* Chat Input area */}
              <Input
                variant="filled"
                bg="#E0E0E0"
                placeholder='Enter a Message...'
                onChange={typingHandler}
                value={newMessage}
                color="white"
              />
            </FormControl>
          </Box>
        </>
      ) : 
      // If no chat is selected this box will be shown 
      (
        <Box display="flex" alignItems="center" justifyContent="center" h="100%">
          <Text fontSize="5xl" pb={3} fontFamily="Work sans" fontWeight={600}>
            ChatUP
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;