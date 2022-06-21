/* eslint-disable react/no-array-index-key */
import {
  Container,
  Heading,
  Text,
  useDisclosure,
  useToast,
  Skeleton,
  VStack,
  Button,
} from '@chakra-ui/react';
import { useQuery, useQueryClient } from 'react-query';
import { useRouter } from 'next/router';
import React, { useState, useRef } from 'react';
import dayjs from 'dayjs';
import Head from 'next/head';

import buddhistEra from 'dayjs/plugin/buddhistEra';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import AxiosInstance from '../lib/api';

dayjs.extend(buddhistEra);
require('dayjs/locale/th');

if (typeof window !== 'undefined') {
  AxiosInstance.defaults.headers.common = {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  };
}

dayjs.locale('th');

function Home() {
  const toast = useToast();
  const cancelRef = useRef();
  const {
    isOpen: isDeleteDialogOpen,
    onOpen: onOpenDeleteDialog,
    onClose: onCloseDeleteDialog,
  } = useDisclosure();
  const [selectedEvidence, setSelectedEvidence] = useState(null);
  const [evidenceSearchId, setEvidenceSearchId] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagesCount, setPagesCount] = useState(1);
  const router = useRouter();
  const qClient = useQueryClient();

  // Methods

  const fetchAuth = async () => {
    try {
      const res = await AxiosInstance.get('/checkAuth');
      return res.data;
    } catch (error) {
      return router.push('/login');
    }
  };

  const fetchReport = async () => {
    try {
      const res = await AxiosInstance.get('/evidence/genreport');
      return res.data;
    } catch (error) {
      return [];
    }
  };

  const { data: report, isLoading } = useQuery(
    ['evidences data', currentPage],
    () => fetchReport()
  );

  const { data: auth } = useQuery('auth data', fetchAuth);
  const { count, data } = report ?? {};

  if (isLoading) {
    return (
      <VStack mt='16'>
        <Skeleton width='80%' height='40px' />
        <Skeleton width='80%' height='40px' />
      </VStack>
    );
  }

  const text = `สถิติของกลาง
วันที่ ${dayjs().format('DD MMM BBBB')}
ร้อยเวรแลป : ${auth?.fullName}
- ของกลาง จำนวน ${count?.pendings} รายการ
${data?.pendings
  ?.map(({ evidenceId, policeStation, stationId }) => {
    const type = stationId === 1 ? 'สน.' : 'สภ.';
    return `${evidenceId} ${type} ${policeStation.split(' - ')[0]}`;
  })
  .join('\n')}
- คืนของกลาง จำนวน ${count?.returns} รายการ
${data?.returns
  ?.map(({ evidenceId, policeStation, stationId }) => {
    const type = stationId === 1 ? 'สน.' : 'สภ.';
    return `${evidenceId} ${type} ${policeStation.split(' - ')[0]}`;
  })
  .join('\n')}`;

  console.log(data?.pendings);

  return (
    <>
      <Head>
        <title>สถิติของกลาง</title>
      </Head>
      <Container maxW='container.xl' mt='8'>
        <Heading mb='4'>รายงาน</Heading>
        <Heading fontSize='xl' mb='4'>
          วันที่ {dayjs().format('DD MMM BBBB')}
        </Heading>
        <Text>ร้อยเวรแลป : {auth?.fullName}</Text>
        <Text>- ของกลาง จำนวน {count?.pendings} รายการ</Text>
        {data?.pendings?.map(({ evidenceId, policeStation, stationId }) => {
          const type = stationId === 1 ? 'สน.' : 'สภ.';
          return (
            <Text>
              {evidenceId} {type}
              {policeStation.split(' - ')[0]}
            </Text>
          );
        })}
        <Text>- คืนของกลาง จำนวน {count?.returns} รายการ</Text>
        {data?.returns?.map(({ evidenceId, policeStation, stationId }) => {
          const type = stationId === 1 ? 'สน.' : 'สภ.';
          return (
            <Text>
              {evidenceId} {type}
              {policeStation.split(' - ')[0]}
            </Text>
          );
        })}
        <CopyToClipboard
          text={text}
          onCopy={() => toast({ title: 'คัดลอกสำเร็จ!', status: 'success' })}
        >
          <Button mt='4' colorScheme='blue'>
            คัดลอก
          </Button>
        </CopyToClipboard>
      </Container>
    </>
  );
}

export default Home;
