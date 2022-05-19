import {
  Container,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Heading,
  Flex,
  Button,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import AxiosInstance from '../lib/api';
import dayjs from 'dayjs';
import Link from 'next/link';

if (typeof window !== 'undefined') {
  AxiosInstance.defaults.headers.common = {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  };
}

const Home = () => {
  const [evidences, setEvidences] = useState([]);
  const fetchEvidences = async () => {
    try {
      const res = await AxiosInstance.get('/evidence');
      setEvidences(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const router = useRouter();
  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await AxiosInstance.get('/checkAuth');
      } catch (error) {
        router.push('/login');
      }
    };
    fetch();
    fetchEvidences();
  }, []);

  return (
    <Container maxW={'container.lg'} mt='8'>
      <Heading mb='4'>รายการหลักฐาน</Heading>
      <Flex justify={'end'} mb='4'>
        <Link href='/new'>
          <Button colorScheme={'blue'}>สร้างรายการ</Button>
        </Link>
      </Flex>
      <TableContainer>
        <Table variant='striped' colorScheme={'teal'}>
          <Thead bgColor='orange.500'>
            <Tr>
              <Th color='white'>สถานะ</Th>
              <Th color='white'>เลข ก</Th>
              <Th color='white'>วันที่รับของ</Th>
              <Th color='white'>สน / สภ</Th>
              <Th color='white'>เลขหนังสือนำส่ง</Th>
              <Th color='white'>ลงวันที่</Th>
              <Th color='white'>พนักงานสอบสวน</Th>
              <Th color='white'>เบอร์โทรพนักงานสอบสวน</Th>
              <Th color='white'>รายการของกลาง</Th>
              <Th color='white'>ตู้</Th>
              <Th color='white'>เทคนิค</Th>
              <Th color='white'>ร้อยเวร</Th>
              <Th color='white'>ผู้ช่วย</Th>
            </Tr>
          </Thead>
          <Tbody>
            {evidences.map(
              ({
                id,
                evidenceId,
                receivedDate,
                policeStation,
                packageId,
                packageDate,
                detectiveName,
                detectivePhone,
                itemsDescription,
                storedAt,
                LTName,
                technique,
                status,
                owner,
              }) => (
                <>
                  <Tr key={id}>
                    <Td>{status}</Td>
                    <Td>{evidenceId}</Td>
                    <Td>{dayjs(receivedDate).format('DD/MM/YY')}</Td>
                    <Td>{policeStation}</Td>
                    <Td>{packageId}</Td>
                    <Td>{dayjs(packageDate).format('DD/MM/YY')}</Td>
                    <Td>{detectiveName}</Td>
                    <Td>{detectivePhone}</Td>
                    <Td>{itemsDescription}</Td>
                    <Td>{storedAt}</Td>
                    <Td>{technique}</Td>
                    <Td>{LTName}</Td>
                    <Td>{owner.name}</Td>
                  </Tr>
                </>
              )
            )}
          </Tbody>
          {/* <Tfoot>
            <Tr>
              <Th>To convert</Th>
              <Th>into</Th>
              <Th isNumeric>multiply by</Th>
            </Tr>
          </Tfoot> */}
        </Table>
      </TableContainer>
    </Container>
  );
};

export default Home;
