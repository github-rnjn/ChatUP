import React from 'react'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    IconButton,
    Button,
    Image,
    Text,
  } from '@chakra-ui/react'
  import { GrView } from "react-icons/gr";
import { useDisclosure } from '@chakra-ui/react'
const ProfileModal = ({user,children}) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    return (
        <>
            {
                children?<span onClick={onOpen}>{children}</span>:<IconButton display={{base:"flex"}} icon={<GrView/>} onClick={onOpen}/>
            }
            <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent display="flex" justifyContent="center" alignItems="center" h="410px">
                    <ModalHeader
                    fontSize="40px"
                    fontFamily="work sans"
                    display="flex"
                    justifyContent="center"
                    >{user.name}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody display="flex" flexDirection="column" alignItems="center">
                        {/* Profile Logo  */}
                        <Image
                        borderRadius="full"
                        boxSize="150px"
                        src={user.pic}
                        alt={user.name}
                        />
                        {/* Email  */}
                        <Text
                        fontSize={{base:"28px",md:"30px"}}
                        fontFamily="work sans"
                        >Email:{user.email}</Text>
                    </ModalBody>
                    {/* Close Button  */}
                    <ModalFooter>
                        <Button colorScheme='red' mr={3} onClick={onClose}>Close</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default ProfileModal
