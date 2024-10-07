import React, { useEffect } from 'react'
import {Box, Container, Text} from '@chakra-ui/react'
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import Login from '../components/Login'
import Signup from '../components/Signup'
import { useNavigate } from 'react-router-dom'
const HomePage = () => {
  const navigate = useNavigate()
  useEffect(()=>{
    const user = JSON.parse(localStorage.getItem("userInfo"))
    if(user) navigate("/chats")
  },[navigate])
  return (
    <Container maxW="xl" centerContent>
      <Box
        d="flex"
        justifyContent="center"
        p={3}
        bg="white"
        w="100%"
        m="40px 0 15px 0"
        borderRadius="lg"
        borderWidth="1px"
        backgroundColor="#131842"
      >
        {/* Title */}
        <Text fontSize="4xl" fontFamily="Work sans" textAlign="center" fontWeight="bold" color="white">
          ChatUP
        </Text>
      </Box>

      <Box bg="white" w="100%" p={4} borderRadius="lg" borderWidth="1px">
        {/* Login and Signup will be divided into 2 tabs and user can switch it  */}
        <Tabs variant='soft-rounded' colorScheme='green'>
            <TabList>
                <Tab width="50%">Log in</Tab>
                <Tab width="50%">Sign up</Tab>
            </TabList>
            <TabPanels>
                <TabPanel>
                    <Login/>
                </TabPanel>
                <TabPanel>
                    <Signup/>  
                </TabPanel>
            </TabPanels>
        </Tabs>
      </Box>
    </Container>
  )
}

export default HomePage
