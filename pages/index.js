/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/alt-text */
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
  Box,
  Modal,
  ModalOverlay,
  ModalContent,
  Center,
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
import Image from 'next/image';
import { QRCodeSVG } from 'qrcode.react';
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
  const {
    isOpen: isQrOpen,
    onOpen: openQr,
    onClose: closeQr,
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

  const onClickQr = (evidence) => {
    openQr();
    setSelectedEvidence(evidence);
  };

  const renderStatus = (status) => {
    switch (status) {
      case 'pending':
        return '????????????????????????????????????';
      case 'labAll':
        return '???????????????????????????????????? (?????????????????????)';
      case 'labPartial':
        return '???????????????????????????????????? (?????????????????????)';
      case 'returnedAll':
        return <Text color='red.500'>????????? ?????????. ???????????? (?????????????????????)</Text>;
      case 'returnedPartial':
        return '????????? ?????????. ???????????? (?????????????????????)';
      case 'other':
        return '?????????????????????????????????????????????????????????';
      case 'deleted':
        return '???????????????';
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
        <title>???????????????????????????????????????</title>
      </Head>
      <Container maxW='container.xl' mt='8'>
        <Heading mb='4'>???????????????????????????????????????</Heading>
        {/* <Flex justify='end' mb='8'>
          <Link href='/new'>
            <Button colorScheme={'blue'}>?????????????????????????????????</Button>
          </Link>
        </Flex> */}
        <HStack justify='space-between' mb='4'>
          <InputGroup>
            <InputLeftElement pointerEvents='none'>
              <SearchIcon />
            </InputLeftElement>
            <Input
              onKeyDown={(e) => e.key === 'Enter' && handleOnClickSearch()}
              placeholder='??????????????????????????????????????????????????????'
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
            />
          </InputGroup>
          <Button colorScheme='green' onClick={handleOnClickSearch}>
            ???????????????
          </Button>
        </HStack>
        <TableContainer>
          <Table variant='striped' colorScheme='twitter'>
            <Thead bgColor='orange.500'>
              <Tr>
                <Th color='white' />
                <Th color='white'>???????????????</Th>
                <Th color='white'>????????? ???</Th>
                <Th color='white'>????????????????????????????????????</Th>
                <Th color='white'>??????. / ??????.</Th>
                <Th color='white'>?????????????????????????????????????????????</Th>
                <Th color='white'>????????????????????????</Th>
                <Th color='white'>???????????????????????????????????????</Th>
                <Th color='white'>???????????????????????????????????????????????????????????????</Th>
                <Th color='white'>???????????????????????????????????????</Th>
                <Th color='white'>?????????</Th>
                <Th color='white'>??????????????????</Th>
                <Th color='white'>?????????????????????</Th>
                <Th color='white'>?????????????????????</Th>
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
                        <img
                          src='/images/scan.png'
                          width={20}
                          style={{ cursor: 'pointer' }}
                          onClick={() => onClickQr(evidence)}
                        />
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
            <AlertTitle>??????????????????????????????????????????</AlertTitle>
            <AlertDescription>
              ????????????????????????????????????????????????????????? ????????????????????????????????????????????? ????????????????????????????????????
            </AlertDescription>
          </Alert>
        )}
        <AlertDialog isOpen={isDeleteDialogOpen} onClose={onCloseDeleteDialog}>
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                ?????????????????????????????????
              </AlertDialogHeader>
              <AlertDialogBody>?????????????????????????????????????????????????????????????????????????</AlertDialogBody>
              <AlertDialogFooter>
                <Button ref={cancelRef} onClick={onCloseDeleteDialog}>
                  ??????????????????
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
                        title: '????????????????????????',
                        status: 'success',
                        duration: 3000,
                        isClosable: true,
                      });
                      fetchEvidences();
                    } catch (error) {
                      toast({
                        title: '???????????????????????????',
                        status: 'error',
                        duration: 3000,
                        isClosable: true,
                      });
                    }
                  }}
                  ml={3}
                >
                  ?????????????????????????????????
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      </Container>
      <Modal isOpen={isQrOpen} onClose={closeQr}>
        <ModalOverlay>
          <ModalContent>
            <Center p='8'>
              <VStack spacing='8'>
                <Text fontSize='xl' fontWeight='bolder' color='blue'>
                  {selectedEvidence?.evidenceId}
                </Text>
                <QRCodeSVG
                  value={`${window.location.href}${selectedEvidence?.id}/edit`}
                />
                <Button
                  colorScheme='green'
                  onClick={() => window.print()}
                  sx={{
                    '@media print': {
                      display: 'none',
                    },
                  }}
                >
                  ??????????????? QR Code
                </Button>
                <Button
                  colorScheme='red'
                  onClick={closeQr}
                  sx={{
                    '@media print': {
                      display: 'none',
                    },
                  }}
                >
                  ?????????
                </Button>
              </VStack>
            </Center>
          </ModalContent>
        </ModalOverlay>
      </Modal>
    </>
  );
}

export default Home;
