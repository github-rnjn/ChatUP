import { Box, Button, Input, Spinner, Text, Tooltip, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { CiSearch } from "react-icons/ci";
import { FaBell } from "react-icons/fa";
import { FaChevronDown } from "react-icons/fa";
import { Avatar } from '@chakra-ui/react'
import { ChatState } from '../contexts/ChatProvider';
import {
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
  } from '@chakra-ui/react'
  import {
    Drawer,
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
  } from '@chakra-ui/react'
import { useDisclosure } from '@chakra-ui/react';
import ProfileModal from './ProfileModal';
import axios from 'axios'
import ChatLoading from './ChatLoading';
import UserListItem from './UserListItem';
import { getSender } from '../config/ChatLogics';
import '../styles.css'

const SideDrawer = () => {
    const [search,setSearch] = useState("")
    const [searchResult,setSearchResult] = useState([])
    const [loading,setLoading] = useState(false)
    const [loadingChat,setLoadingChat] = useState()
    const {user,setSelectedChat,chats,setChats,notification,setNotification} = ChatState()
    const navigate = useNavigate()
    const logoutHandler = ()=>{
        localStorage.removeItem("userInfo")
        navigate("/")
    }
    const { isOpen, onOpen, onClose } = useDisclosure()
    const btnRef = React.useRef()
    const toast = useToast()
    const handleSearch = async()=>{
            if(!search){
                toast({
                    title:"Please Enter something in search",
                    status:"warning",
                    duration:5000,
                    isClosable:true,
                    position:"top-left",
                }) 
                return;
            }
            try {
                setLoading(true)
                const config = {
                    headers:{
                        Authorization:`Bearer ${user.token}`
                    },
                }
                const {data} = await axios.get(`/api/user?search=${search}`,config)
                setLoading(false)
                setSearchResult(data)
            } catch (error) {
                toast({
                    title:"User not found",
                    description:"Failed to Load the Search Result",
                    status:"error",
                    duration:5000,
                    isClosable:true,
                    position:"bottom-left",
                })
                return;
            }
    }
    const accessChat = async (userId)=>{
        try {
            setLoadingChat(true)
            const config = {
                headers:{
                    "Content-type":"application/json",
                    Authorization:`Bearer ${user.token}`
                },
            }
            const {data} = await axios.post('/api/chat',{userId},config);
            if(!chats.find((c)=>c._id===data._id)){
                setChats([data,...chats])
            }
            setSelectedChat(data)
            setLoadingChat(false)
            onClose()
        } catch (error) {
            toast({
                title:"Error Fetching the chat",
                description:error.message,
                status:"error",
                duration:5000,
                isClosable:true,
                position:"bottom-left",
            })
            return;
        }
    }
    return (
        <>
            <Box display="flex" justifyContent="space-between" alignItems="center" w="100%" p="2px 15px 2px 15px" borderWidth="5px" backgroundColor="#131842" borderRadius="25px">
                {/* Search Button To Search the User  */}
                <Tooltip label="Search Users to chat" hasArrow placement='bottom-end'>
                    <Button variant="ghost" border="1px">
                        <CiSearch style={{height:"25px",width:"25px",color:"white",}} onClick={onOpen} />
                    </Button>
                </Tooltip>
                {/* Logo */}
                <Text fontSize={{base:"xl",sm:"2xl"}} fontFamily="work sans" fontWeight="bold" color="white">ChatUP</Text>
                {/* Notification Badge */}
                <div style={{display:"flex",justifyContent:"center",alignItems:"center"}} >
                    <Menu>
                        <MenuButton p={1}>
                        <div style={{display:"flex",alignItems:"center",justifyContent:"center"}}>
                            {notification.length > 0 && (
                                <div className="notification-badge ">
                                    <span className="badge">    
                                        {notification.length}
                                    </span>
                                </div>
                            )}
                        </div>
                        <FaBell style={{color:"white",fontSize:"20px",marginRight:"5px"}}/>
                        </MenuButton>
                        <MenuList pl={2}>
                            {
                                !notification.length && "No new Messages"
                            }
                            {notification.map((notif)=>(
                                <MenuItem key={notif._id} onClick={()=>{
                                    setSelectedChat(notif.chat)
                                    setNotification(notification.filter((n)=>n!==notif))
                                }}>
                                    {notif.chat.isGroupChat?`New Message in ${notif.chat.chatName}`:`New Message from ${getSender(user,notif.chat.users)}`}
                                </MenuItem>
                            ))}
                        </MenuList>
                    </Menu>
                    <Menu>
                        {/* Avatar Region */}
                        <MenuButton as={Button} rightIcon={<FaChevronDown/>}>
                            <Avatar size="sm" cursor="pointer" name={user.name} src={user.pic}/>
                        </MenuButton>
                        <MenuList>
                            <ProfileModal user={user}>
                                <MenuItem fontWeight="semibold">MyProfile</MenuItem>
                            </ProfileModal>
                            <MenuItem fontWeight="semibold" onClick={logoutHandler}>Logout</MenuItem>
                        </MenuList>
                    </Menu>
                </div>
            </Box>
            {/* Side drawer */}
            <Drawer
            isOpen={isOpen}
            placement='left'
            onClose={onClose}
            finalFocusRef={btnRef}
            >
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>

                    <DrawerBody>
                        {/* Search Region */}
                        <Box display="flex" pb={2}>
                            <Input placeholder='Search by name or email' mr={2} value={search} onChange={(e)=>setSearch(e.target.value)}/>
                            <Button onClick={handleSearch}>
                                <CiSearch style={{height:"20px",width:"20px"}} />
                            </Button>
                        </Box>
                        {/* Show the searched results */}
                        {
                            loading?(
                                <ChatLoading/>
                            ):(
                                searchResult?.map(user=>(
                                    <UserListItem key={user._id} user={user} handleFunction={()=>accessChat(user._id)}/>
                                ))
                            )
                        }
                        {loadingChat && <Spinner ml="auto" display="flex"/>}
                    </DrawerBody>

                    <DrawerFooter>

                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </>
    )
}

export default SideDrawer
