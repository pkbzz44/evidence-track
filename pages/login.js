import {
  Button,
  Center,
  Container,
  Heading,
  Input,
  VStack,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import AxiosInstance from '../lib/api';
if (typeof window !== 'undefined') {
  AxiosInstance.defaults.headers.common = {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  };
}
const Login = () => {
  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await AxiosInstance.get('checkAuth');
        router.push('/');
      } catch (error) {
        // router.push('/login');
      }
    };
    fetch();
  }, []);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = async (data) => {
    try {
      const res = await AxiosInstance.post('/login', data);
      localStorage.setItem('token', res.data);
      router.reload();
    } catch (error) {
      console.log(error);
    }
  };

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
