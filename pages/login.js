/* eslint-disable react/jsx-props-no-spreading */
import {
  Button,
  Center,
  Container,
  Heading,
  Input,
  VStack,
  useToast,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery } from 'react-query';
import AxiosInstance from '../lib/api';

if (typeof window !== 'undefined') {
  AxiosInstance.defaults.headers.common = {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  };
}
function Login() {
  const router = useRouter();

  const toast = useToast();
  const { data } = useQuery('fetch auth', () =>
    AxiosInstance.get('/checkAuth')
  );

  if (data?.status === 200) router.push('/');

  const { mutate, isLoading: isLoggingIn } = useMutation(
    (data) => AxiosInstance.post('/login', data),
    {
      onSuccess: (data) => {
        localStorage.setItem('token', data.data);
        router.reload();
        toast({ title: 'เข้าสู่ระบบสำเร็จ', status: 'success' });
      },
      onError: () =>
        toast({
          title: 'ชื่อผู้ใช้ หรือ รหัสผ่านผิดพลาด กรุณาลองอีกครั้ง',
          status: 'error',
        }),
    }
  );

  const { register, handleSubmit } = useForm();

  const onSubmit = async (data) => {
    mutate(data);
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
          <Button colorScheme='blue' type='submit' isLoading={isLoggingIn}>
            ยืนยัน
          </Button>
        </VStack>
      </form>
    </Container>
  );
}

export default Login;
