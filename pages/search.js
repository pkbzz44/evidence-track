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
  Select,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  useToast,
  VStack,
  Input,
  InputGroup,
  InputLeftElement,
  Stack,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Radio,
  RadioGroup,
  Spinner,
  Center,
} from '@chakra-ui/react';
import { EditIcon, DeleteIcon, SearchIcon } from '@chakra-ui/icons';
import { useRouter } from 'next/router';
import React, { useEffect, useState, useRef } from 'react';
import dayjs from 'dayjs';
import Head from 'next/head';
import DatePicker from 'react-date-picker/dist/entry.nostyle';
import AxiosInstance from '../lib/api';
import {
  policeStation as policeStations,
  provinces,
  status as statuses,
} from '../lib/helper/static';
import { renderPoliceStation } from '../lib/helper';

if (typeof window !== 'undefined') {
  AxiosInstance.defaults.headers.common = {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  };
}

function AdvancedSearch() {
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState('all');
  const toast = useToast();
  const cancelRef = useRef();
  const {
    isOpen: isDeleteDialogOpen,
    onOpen: onOpenDeleteDialog,
    onClose: onCloseDeleteDialog,
  } = useDisclosure();
  const [evidences, setEvidences] = useState([]);
  const [selectedEvidence, setSelectedEvidence] = useState(null);
  const [evidenceSearchId, setEvidenceSearchId] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [stationType, setStationType] = useState('0');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [policeStation, setPoliceStation] = useState(null);

  const router = useRouter();

  // Methods
  const fetchEvidences = async () => {
    setIsLoading(true);
    const st = Number(stationType);
    try {
      const res = await AxiosInstance.get('/evidence', {
        params: {
          evidenceId: evidenceSearchId !== '' ? evidenceSearchId : null,
          stationType: st > 0 ? st : null,
          status: status !== 'all' ? status : null,
          receivedStartDate: startDate,
          receivedEndDate: endDate,
          policeStation: policeStation || null,
        },
      });
      setEvidences(res.data.data);
      setIsLoading(false);
    } catch (error) {
      setEvidences([]);
      setIsLoading(false);
    }
  };

  const handleOnClickSearch = () => {
    fetchEvidences();
    setHasSearched(true);
  };

  const handleDelete = (evidence) => {
    setSelectedEvidence(evidence);
    onOpenDeleteDialog();
  };

  useEffect(() => {
    const fetch = async () => {
      try {
        await AxiosInstance.get('/checkAuth');
      } catch (error) {
        router.push('/login');
      }
    };
    fetch();
    // fetchEvidences();
  }, []);

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
        return '';
    }
  };
  const renderStationOptions = () => {
    if (stationType === '1') {
      return (
        <Select
          value={policeStation}
          onChange={(e) => setPoliceStation(e.target.value)}
          placeholder='สน. ทั้งหมด'
        >
          {policeStations.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </Select>
      );
    }
    if (stationType === '2') {
      return (
        <Select
          value={policeStation}
          onChange={(e) => setPoliceStation(e.target.value)}
          placeholder='จังหวัดทั้งหมด'
        >
          {provinces
            .sort((a, b) => a.name_th.localeCompare(b.name_th, 'th'))
            .map(({ name_th, name_en }) => (
              <option key={name_en} value={name_en}>
                {name_th}
              </option>
            ))}
        </Select>
      );
    }
    if (stationType === '3') {
      return (
        <Select
          value={policeStation}
          onChange={(e) => setPoliceStation(e.target.value)}
          placeholder='หน่วยงานทั้งหมด'
        >
          <option value='drug-1'>กองบัญชาการตำรวจปราบปรามยาเสพติด 1</option>
          <option value='drug-2'>กองบัญชาการตำรวจปราบปรามยาเสพติด 2</option>
          <option value='drug-3'>กองบัญชาการตำรวจปราบปรามยาเสพติด 3</option>
          <option value='drug-4'>กองบัญชาการตำรวจปราบปรามยาเสพติด 4</option>
          <option value='etc'>อื่นๆ</option>
        </Select>
      );
    }
  };

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
        <VStack alignItems='start'>
          <Text>กรุณาเลือกประเภท</Text>
          <RadioGroup
            onChange={(value) => {
              setPoliceStation(null);
              setStationType(value);
            }}
            value={stationType}
          >
            <Stack direction='row'>
              <Radio value='0'>ทั้งหมด</Radio>
              <Radio value='1'>สภ.</Radio>
              <Radio value='2'>สน.</Radio>
              <Radio value='3'>อื่นๆ</Radio>
            </Stack>
          </RadioGroup>
          {renderStationOptions()}
          <Text>สถานะ</Text>
          <Select
            errorBorderColor='crimson'
            defaultValue='pending'
            // placeholder='กรุณาเลือกสถานะ'
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value='all'>ทั้งหมด</option>
            {statuses.map(({ value, label }) => (
              <option value={value}>{label}</option>
            ))}
          </Select>
          <Text>วันที่รับของ เริ่มต้น - สิ้นสุด</Text>
          <HStack w='100%'>
            <DatePicker
              locale='th-TH'
              value={startDate}
              onChange={(date) => setStartDate(date)}
            />
            <Text>-</Text>
            <DatePicker
              locale='th-TH'
              value={endDate}
              onChange={(date) => setEndDate(date)}
            />
          </HStack>
          <Text>ค้นหาด้วยรหัส</Text>
          <HStack justify='space-between' mb='4' w='100%'>
            <InputGroup>
              <InputLeftElement pointerEvents='none'>
                <SearchIcon zIndex={0} />
              </InputLeftElement>
              <Input
                onKeyDown={(e) => e.key === 'Enter' && handleOnClickSearch()}
                placeholder='กรอกรหัสเพื่อค้นหา'
                value={evidenceSearchId}
                onChange={(e) => setEvidenceSearchId(e.target.value)}
              />
            </InputGroup>
            <Button colorScheme='green' onClick={handleOnClickSearch}>
              ค้นหา
            </Button>
          </HStack>
        </VStack>
        {isLoading && (
          <Center mt='4'>
            <Spinner />
          </Center>
        )}
        {hasSearched && !isLoading && (
          <TableContainer mt='4'>
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
                {evidences.map((evidence) => {
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
                    technique,
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
                      <Td>{technique}</Td>
                      <Td>{LTName}</Td>
                      <Td>{owner.name}</Td>
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>
          </TableContainer>
        )}
        {evidences.length === 0 && hasSearched && !isLoading && (
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

export default AdvancedSearch;
