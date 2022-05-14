import {
  Button,
  Center,
  Container,
  Heading,
  Input,
  VStack,
} from '@chakra-ui/react';
import React from 'react';

const Login = () => {
  return (
    <Container maxW='container.md' mt='24'>
      <Center>
        <Heading mb='4'>เข้าสู่ระบบ</Heading>
      </Center>
      <form>
        <VStack>
          <Input placeholder='กรุณากรอกชื่อ' />
          <Input placeholder='กรุณากรอกรหัสผ่าน' />
          <Button colorScheme='blue' type='submit'>
            ยืนยัน
          </Button>
        </VStack>
      </form>
    </Container>
  );
};

export default Login;
