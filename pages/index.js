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
      <Flex justify={'end'}>
        <Link href='/new'>
          <Button colorScheme={'blue'}>สร้างรายการ</Button>
        </Link>
      </Flex>
      <TableContainer>
        <Table variant='striped' colorScheme={'teal'}>
          <Thead>
            <Tr>
              <Th>สถานะ</Th>
              <Th>ก</Th>
              <Th>วันที่รับของ</Th>
              <Th>สน</Th>
              <Th>เลขหนังสือนำส่ง</Th>
              <Th>ลงวันที่</Th>
              <Th>พงส</Th>
              <Th>โทร พงส</Th>
              <Th>รายการของกลาง</Th>
              <Th>ตู้</Th>
              <Th>เทคนิค</Th>
              <Th>ร้อยเวร</Th>
              <Th>ผู้ช่วย</Th>
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
