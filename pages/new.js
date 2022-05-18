import {
  Button,
  Center,
  Container,
  Heading,
  HStack,
  Input,
  Select,
  Text,
  VStack,
  RadioGroup,
  Radio,
  Textarea,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import AxiosInstance from '../lib/api';
import DatePicker from 'react-date-picker/dist/entry.nostyle';

if (typeof window !== 'undefined') {
  AxiosInstance.defaults.headers.common = {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  };
}
const NewEvidence = () => {
  const [auth, setAuth] = useState(null);
  const [receivedDate, setReceivedDate] = useState(new Date());
  const [packageDate, setPackageDate] = useState(new Date());

  const [stationType, setStationType] = useState('1');
  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await AxiosInstance.get('checkAuth');
        setAuth(res.data);
      } catch (error) {
        router.push('/login');
      }
    };
    fetch();
  }, []);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();
  console.log(watch('status'));

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
    <Container maxW='container.lg' mt='24' mb='8'>
      <Center>
        <Heading mb='4'>สร้างรายการ</Heading>
      </Center>
      <form onSubmit={handleSubmit(onSubmit)}>
        <VStack align='start'>
          <Text>สถานะ</Text>
          <Select placeholder='กรุณาเลือกสถานะ' {...register('status')}>
            <option value='pending'>ยังไม่ได้คืน</option>
            <option value='labAll'>ส่งต่องาน แฝง (ทั้งหมด)</option>
            <option value='labPartial'>ส่งต่องาน แฝง (บางส่วน)</option>
            <option value='returnedAll'>คืน พงส. แล้ว (ทั้งหมด)</option>
            <option value='returnedPartial'>คืน พงส. แล้ว (บางส่วน)</option>
            <option value='other'>ส่งต่อกลุ่มงานอื่นๆ ระบุ</option>
          </Select>
          {watch('status') === 'other' && (
            <Input
              placeholder='กรุณาระบุหน่วยงานอื่นๆ'
              {...register('otherName')}
            />
          )}
          <Text>ก</Text>
          <Input placeholder='ก' {...register('evidenceId')} />
          <Text>วันที่รับของ</Text>
          <DatePicker
            locale='th-TH'
            onChange={(date) => setReceivedDate(date)}
            value={receivedDate}
          />
          <Text>ประเภท</Text>
          <RadioGroup
            value={stationType}
            onChange={(val) => setStationType(val)}
          >
            <HStack>
              <Radio value='1'>สน.</Radio>
              <Radio value='2'>สภ.</Radio>
              <Radio value='3'>อื่นๆ</Radio>
            </HStack>
          </RadioGroup>
          {stationType === '1' && (
            <Select placeholder='กรุณาเลือกสน' {...register('station')}>
              <option value='bangbon'>บางบอน</option>
            </Select>
          )}
          <Text>เลขหนังสือนำส่ง</Text>
          <Input placeholder='เลขหนังสือนำส่ง' {...register('packageId')} />
          <Text>ลงวันที่</Text>
          <DatePicker
            locale='th-TH'
            onChange={(date) => setPackageDate(date)}
            value={packageDate}
          />
          <Text>พงส</Text>
          <Input placeholder='พงส' {...register('detectiveName')} />
          <Text>โทร พงส.</Text>
          <Input placeholder='โทร พงส.' {...register('detectivePhone')} />
          <Text>รายการของกลาง</Text>
          <Textarea
            placeholder='รายการของกลาง'
            {...register('itemsDescription')}
          />
          <Text>ตู้</Text>
          <Input placeholder='ตู้' {...register('storedAt')} />
          <Text>เทคนิค</Text>
          <Select placeholder='กรุณาเลือกเทคนิค' {...register('technique')}>
            <option value='G+P'>G+P</option>
          </Select>
          <Text>ร้อยเวร</Text>
          <Input placeholder='ร้อยเวร' {...register('LTName')} />
          <Text>ผู้ช่วย</Text>
          <Input placeholder='ผู้ช่วย' defaultValue={auth?.name} disabled />

          <Button colorScheme='blue' type='submit'>
            ยืนยัน
          </Button>
        </VStack>
      </form>
    </Container>
  );
};

export default NewEvidence;
