/* eslint-disable react/no-array-index-key */
import {
  Container,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Heading,
  Button,
  Text,
  HStack,
  useDisclosure,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  useToast,
  Skeleton,
  VStack,
  Input,
  InputGroup,
  InputLeftElement,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Stack,
} from '@chakra-ui/react';
import { useQuery, useQueryClient } from 'react-query';
import { EditIcon, DeleteIcon, SearchIcon } from '@chakra-ui/icons';
import { useRouter } from 'next/router';
import React, { useState, useRef, useEffect } from 'react';
import dayjs from 'dayjs';
import Head from 'next/head';
import {
  Pagination,
  usePagination,
  PaginationNext,
  PaginationPage,
  PaginationPrevious,
  PaginationContainer,
  PaginationPageGroup,
} from '@ajna/pagination';
import { renderPoliceStation } from '../lib/helper';
import AxiosInstance from '../lib/api';

if (typeof window !== 'undefined') {
  AxiosInstance.defaults.headers.common = {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  };
}

function Home() {
  const toast = useToast();
  const cancelRef = useRef();
  const {
    isOpen: isDeleteDialogOpen,
    onOpen: onOpenDeleteDialog,
    onClose: onCloseDeleteDialog,
  } = useDisclosure();
  const [selectedEvidence, setSelectedEvidence] = useState(null);
  const [searchId, setSearchId] = useState(null);

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

  const fetchEvidences = async ({ queryKey }) => {
    const [key, page, id] = queryKey;
    try {
      const res = await AxiosInstance.get('/evidence', {
        params: {
          evidenceId: id !== '' ? id : null,
          page: page - 1,
        },
      });
      return res.data;
    } catch (error) {}
    return [];
  };

  const { data: evidences, isLoading } = useQuery(
    ['evidences data', currentPage, evidenceSearchId],
    fetchEvidences
  );

  useEffect(() => {
    setPagesCount(evidences?.totalPages);
  }, [evidences]);

  useEffect(() => {
    qClient.invalidateQueries('evidences data');
  }, [currentPage]);

  const { data: auth, isLoading: isLoadingAuth } = useQuery(
    'auth data',
    fetchAuth
  );

  const handleOnClickSearch = () => {
    setEvidenceSearchId(searchId);
  };

  const handleDelete = (evidence) => {
    setSelectedEvidence(evidence);
    onOpenDeleteDialog();
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const renderStatus = (status) => {
    switch (status) {
      case 'pending':
        return 'ยังไม่ได้คืน';
      case 'labAll':
        return 'ส่งต่องานแฝง (ทั้งหมด)';
      case 'labPartial':
        return 'ส่งต่องานแฝง (บางส่วน)';
      case 'returnedAll':
        return <Text color='red.500'>คืน พงส. แล้ว (ทั้งหมด)</Text>;
      case 'returnedPartial':
        return 'คืน พงส. แล้ว (บางส่วน)';
      case 'other':
        return 'ส่งต่อกลุ่มงานอื่นๆ';
      case 'deleted':
        return 'ถูกลบ';
      default:
        break;
    }
    return null;
  };

  if (isLoading || isLoadingAuth) {
    return (
      <VStack mt='16'>
        <Skeleton width='80%' height='20px' />{' '}
        <Skeleton width='80%' height='20px' /> <Skeleton />
      </VStack>
    );
  }

  return (
    <>
      <Head>
        <title>รายการหลักฐาน</title>
      </Head>
      <Container maxW='container.xl' mt='8'>
        <Heading mb='4'>รายการหลักฐาน</Heading>
        {/* <Flex justify='end' mb='8'>
          <Link href='/new'>
            <Button colorScheme={'blue'}>สร้างรายการ</Button>
          </Link>
        </Flex> */}
        <HStack justify='space-between' mb='4'>
          <InputGroup>
            <InputLeftElement pointerEvents='none'>
              <SearchIcon />
            </InputLeftElement>
            <Input
              onKeyDown={(e) => e.key === 'Enter' && handleOnClickSearch()}
              placeholder='กรอกรหัสเพื่อค้นหา'
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
            />
          </InputGroup>
          <Button colorScheme='green' onClick={handleOnClickSearch}>
            ค้นหา
          </Button>
        </HStack>
        <TableContainer>
          <Table variant='striped' colorScheme='twitter'>
            <Thead bgColor='orange.500'>
              <Tr>
                <Th color='white' />
                <Th color='white'>สถานะ</Th>
                <Th color='white'>เลข ก</Th>
                <Th color='white'>วันที่รับของ</Th>
                <Th color='white'>สน. / สภ.</Th>
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
              {evidences?.data?.map((evidence) => {
                const {
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
                  techniques,
                  status,
                  owner,
                } = evidence;
                return (
                  <Tr key={id}>
                    <Td>
                      <HStack>
                        <EditIcon
                          cursor='pointer'
                          onClick={() => router.push(`/${id}/edit`)}
                        />
                        <DeleteIcon
                          cursor='pointer'
                          onClick={() => handleDelete(evidence)}
                        />
                      </HStack>
                    </Td>
                    <Td>{renderStatus(status)}</Td>
                    <Td>{evidenceId}</Td>
                    <Td>{dayjs(receivedDate).format('DD/MM/YY')}</Td>
                    <Td>{renderPoliceStation(policeStation)}</Td>
                    <Td>{packageId}</Td>
                    <Td>{dayjs(packageDate).format('DD/MM/YY')}</Td>
                    <Td>{detectiveName}</Td>
                    <Td>{detectivePhone}</Td>
                    <Td>{itemsDescription}</Td>
                    <Td>{storedAt}</Td>
                    <Td>{techniques?.map((t) => `${t} `)}</Td>
                    <Td>{LTName}</Td>
                    <Td>{owner.fullName}</Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </TableContainer>
        <Stack>
          <Pagination
            pagesCount={pagesCount}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          >
            <PaginationContainer mt='2' align='center' justify='end'>
              <PaginationPrevious colorScheme='blue' mr='1'>
                Previous
              </PaginationPrevious>
              <PaginationPageGroup>
                {[...Array(pagesCount)].map((_, page) => (
                  <PaginationPage
                    colorScheme='blue'
                    key={`pagination_page_${page}`}
                    page={page + 1}
                    width='30px'
                    disabled={page === currentPage - 1}
                  />
                ))}
              </PaginationPageGroup>
              <PaginationNext colorScheme='blue' ml='1'>
                Next
              </PaginationNext>
            </PaginationContainer>
          </Pagination>
        </Stack>
        {evidences?.length === 0 && (
          <Alert status='error' w='100%'>
            <AlertIcon />
            <AlertTitle>เกิดข้อผิดพลาด</AlertTitle>
            <AlertDescription>
              ไม่พบรายการที่ค้นหา หรือระบบขัดข้อง กรุณาลองใหม่
            </AlertDescription>
          </Alert>
        )}
        <AlertDialog isOpen={isDeleteDialogOpen} onClose={onCloseDeleteDialog}>
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                ลบรายการนี้
              </AlertDialogHeader>
              <AlertDialogBody>คุณแน่ใจที่จะลบรายการนี้?</AlertDialogBody>
              <AlertDialogFooter>
                <Button ref={cancelRef} onClick={onCloseDeleteDialog}>
                  ยกเลิก
                </Button>
                <Button
                  colorScheme='red'
                  onClick={async () => {
                    try {
                      await AxiosInstance.delete(
                        `evidence/${selectedEvidence.id}/del`
                      );
                      onCloseDeleteDialog();
                      toast({
                        title: 'ลบสำเร็จ',
                        status: 'success',
                        duration: 3000,
                        isClosable: true,
                      });
                      fetchEvidences();
                    } catch (error) {
                      toast({
                        title: 'ลบล้มเหลว',
                        status: 'error',
                        duration: 3000,
                        isClosable: true,
                      });
                    }
                  }}
                  ml={3}
                >
                  ลบรายการนี้
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      </Container>
    </>
  );
}

export default Home;
