import {
  Button,
  Center,
  Container,
  Heading,
  Input,
  VStack,
} from '@chakra-ui/react';
import React from 'react';
import { useForm } from 'react-hook-form';

const Login = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const onSubmit = (data) => console.log(data);
  return (
    <Container maxW='container.md' mt='24'>
      <Center>
        <Heading mb='4'>เข้าสู่ระบบ</Heading>
      </Center>
      <form onSubmit={handleSubmit(onSubmit)}>
        <VStack>
          <Input placeholder='กรุณากรอกชื่อ' {...register('name')} />
          <Input
            type='password'
            placeholder='กรุณากรอกรหัสผ่าน'
            {...register('password')}
          />
          <Button colorScheme='blue' type='submit'>
            ยืนยัน
          </Button>
        </VStack>
      </form>
    </Container>
  );
};

export default Login;
