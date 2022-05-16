import { Container } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import AxiosInstance from '../lib/api';
if (typeof window !== 'undefined') {
  AxiosInstance.defaults.headers.common = {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  };
}

const Home = () => {
  const router = useRouter();
  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await AxiosInstance.get('/checkAuth');
        console.log(res.data);
      } catch (error) {
        router.push('/login');
      }
    };
    fetch();
  }, []);

  return (
    <Container maxW='container.lg'>
      <h1>รายการหลักฐาน</h1>
    </Container>
  );
};

export default Home;
