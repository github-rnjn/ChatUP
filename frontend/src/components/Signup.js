import React, { useState } from 'react'
import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack } from '@chakra-ui/react'
import { useToast } from '@chakra-ui/react'
import axios from 'axios'
import {useNavigate} from 'react-router'

const Signup = () => {
    const [show, setShow] = useState(false)
    const [name,setName] = useState("")
    const [email,setEmail] = useState("")
    const [confirmPassword,setConfirmPassword] = useState("")
    const [password,setPassword] = useState("")
    const [pic,setPic] = useState("")
    const [loading,setLoading] = useState(false)
    const toast = useToast()
    const history = useNavigate()
    const postDetails = (pics)=>{
        setLoading(true)
        if(pics===undefined){
            toast({
                title:"Please Select an Image!",
                status:"warning",
                duration:5000,
                isClosable:true,
                position:"bottom",
            })
            return;
        }
        if(pics.type==="image/jpeg" || pics.type==="image/png"){
            const data = new FormData()
            data.append("file",pics)
            data.append("upload_preset","chatUP")
            data.append("cloud_name","dolkb04oc")
            fetch("https://api.cloudinary.com/v1_1/dolkb04oc/image/upload",{
                method:"post",
                body:data,
            }).then((res)=>res.json())
            .then(data=>{
                setPic(data.url.toString())
                console.log(data.url.toString())
                setLoading(false)
            })
            .catch((err)=>{
                console.log(err);
                setLoading(false)
            })
        }
        else{
            toast({
                title:"Please Select an Image!",
                status:"warning",
                duration:5000,
                isClosable:true,
                position:"bottom",
            })
            return;
        }
    }
    
    const submitHandler = async()=>{
        setLoading(true)
        if(!name || !email || !password || !confirmPassword){
            toast({
                title:"Please Fill all the fields!",
                status:"warning",
                duration:5000,
                isClosable:true,
                position:"bottom",
            })
            return;
        }
        if(password!==confirmPassword){
            toast({
                title:"Password do not match!",
                status:"warning",
                duration:5000,
                isClosable:true,
                position:"bottom",
            })
            return;
        }
        try {
            const config = {
                headers:{
                    "Content-Type":"application/json",
                }
            }
            const {data} = await axios.post("/api/user",{name,email,password,pic},config)
            toast({
                title:"Registration Successfull!!",
                status:"success",
                duration:5000,
                isClosable:true,
                position:"bottom",
            })
            localStorage.setItem('userInfo',JSON.stringify(data))
            setLoading(false)
            history("/chats")
        } catch (error) {
            toast({
                title:"Error Occured!!",
                status:"error",
                duration:5000,
                isClosable:true,
                position:"bottom",
            })
            setLoading(false)
        }
    }
    return (
        <VStack spacing="5px">
        <FormControl id="first-name" isRequired>
            <FormLabel>Name</FormLabel>
            <Input value={name} placeholder='Your Name' onChange={(e)=>setName(e.target.value)}/>
        </FormControl>
        <FormControl id="email" isRequired>
            <FormLabel>Email</FormLabel>
            <Input placeholder='Email' value={email} type='email' onChange={(e)=>setEmail(e.target.value)}/>
        </FormControl>
        <FormControl id="password" isRequired>
            <FormLabel>Password</FormLabel>
            <InputGroup>
                <Input value={password} type={show?'text':'password'} placeholder='Password' onChange={(e)=>setPassword(e.target.value)}/>
                <InputRightElement width="4.5rem">
                    <Button h="1.75em" size="sm" onClick={()=>setShow((prev)=>!prev)}>
                        {show?"Hide":"Show"}
                    </Button>
                </InputRightElement>
            </InputGroup>
        </FormControl>
        <FormControl id="confirm-password" isRequired>
            <FormLabel>Confirm Password</FormLabel>
            <InputGroup>
                <Input value={confirmPassword} type={show?'text':'password'} placeholder='Confirm Password' onChange={(e)=>setConfirmPassword(e.target.value)}/>
                <InputRightElement width="4.5rem">
                    <Button h="1.75em" size="sm" onClick={()=>setShow((prev)=>!prev)}>
                        {show?"Hide":"Show"}
                    </Button>
                </InputRightElement>
            </InputGroup>
        </FormControl>
        <FormControl id="pic" isRequired>
            <FormLabel>Upload Your Profile Picture</FormLabel>
            <Input
              type="file"
              height="100%"
              width="100%"
              aria-hidden="true"
              accept="image/*"
              onChange={(e) => postDetails(e.target.files[0])}
            />
        </FormControl>
        <Button isLoading={loading} colorScheme='blue' width='100%' style={{marginTop:15}} onClick={submitHandler}>
            Sign Up
        </Button>
        </VStack>
    )
}

export default Signup
