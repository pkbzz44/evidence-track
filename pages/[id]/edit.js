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
  Checkbox,
  CheckboxGroup,
  useToast,
  Skeleton,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import DatePicker from 'react-date-picker/dist/entry.nostyle';
import AxiosInstance from '../../lib/api';
import { policeStation, provinces } from '../../lib/helper/static';

if (typeof window !== 'undefined') {
  AxiosInstance.defaults.headers.common = {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  };
}
function EditEvidence() {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const toast = useToast();
  const [auth, setAuth] = useState(null);
  const [receivedDate, setReceivedDate] = useState(new Date());
  const [packageDate, setPackageDate] = useState(new Date());
  const [techniques, setTechniques] = useState([]);
  const [stationType, setStationType] = useState('1');
  const [division, setDivision] = useState(null);
  const [evidence, setEvidence] = useState(null);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
    reset,
  } = useForm({});

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await AxiosInstance.get('checkAuth');
        setAuth(res.data);
      } catch (error) {
        router.push(`/login?next=${router.asPath}`);
      }
    };
    fetch();
  }, []);

  useEffect(() => {
    const fetch = async () => {
      if (router.query.id) {
        try {
          const evidenceRes = await AxiosInstance.get(
            `evidence/${router.query.id}`
          );
          setEvidence(evidenceRes.data);
          setIsLoading(false);
        } catch (error) {}
      }
    };
    fetch();
  }, [router]);

  useEffect(() => {
    reset(evidence);
    setStationType(evidence?.stationType.toString());
    setTechniques(evidence?.techniques);
  }, [evidence]);

  const onSubmit = async (data) => {
    const updatedData = {
      ...data,
      division: Number(division),
      techniques,
      receivedDate,
      packageDate,
      stationType: Number(stationType),
    };
    delete updatedData.id;
    try {
      await AxiosInstance.patch(`/evidence/${router.query.id}`, updatedData);
      toast({
        title: 'แก้ไขสำเร็จ',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      router.push('/');
    } catch (error) {
      console.log(error);
      toast({
        title: 'เกิดเหตุผิดพลาด',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const renderStationOptions = () => {
    if (stationType === '1') {
      return (
        <Select
          placeholder='กรุณาเลือกสน.'
          {...register('policeStation')}
          onChange={(e) => {
            const division = e.target.value.split(' - ')[1];
            setDivision(division);
          }}
        >
          {policeStation.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </Select>
      );
    }
    if (stationType === '2') {
      return (
        <>
          <Select
            placeholder='กรุณาเลือกจังหวัด'
            {...register('province')}
            onChange={(e) => {
              setDivision(0);
            }}
          >
            {provinces
              .sort((a, b) => a.name_th.localeCompare(b.name_th, 'th'))
              .map(({ name_th, name_en }) => (
                <option key={name_en} value={name_en}>
                  {name_th}
                </option>
              ))}
          </Select>
          <Text>ชื่อ สภ.</Text>
          <Input
            placeholder='กรุณากรอกชื่อสภ'
            {...register('policeStation', {
              required: stationType === '2',
            })}
          />
        </>
      );
    }
    if (stationType === '3') {
      return (
        <>
          <Select
            placeholder='กรุณาเลือกหน่วยงาน'
            {...register('stationTypeOther')}
            onChange={(e) => {
              setValue('stationTypeOther', e.target.value);
              setDivision(0);
              setValue('policeStation', e.target.value);
            }}
          >
            <option value='drug-1'>กองบัญชาการตำรวจปราบปรามยาเสพติด 1</option>
            <option value='drug-2'>กองบัญชาการตำรวจปราบปรามยาเสพติด 2</option>
            <option value='drug-3'>กองบัญชาการตำรวจปราบปรามยาเสพติด 3</option>
            <option value='drug-4'>กองบัญชาการตำรวจปราบปรามยาเสพติด 4</option>
            <option value='etc'>อื่นๆ</option>
          </Select>
          {watch('stationTypeOther') === 'etc' && (
            <>
              <Text>หน่วยงานอื่นๆ</Text>

              <Input
                placeholder='กรุณากรอกชื่อหน่วยงาน'
                {...register('stationTypeOtherInput')}
              />
            </>
          )}
        </>
      );
    }
  };

  if (isLoading) return <Skeleton />;

  return (
    <Container maxW='container.lg' mt='24' mb='8'>
      <Center>
        <Heading mb='4'>แก้ไขรายการ</Heading>
      </Center>
      <form onSubmit={handleSubmit(onSubmit)}>
        <VStack align='start' spacing='4'>
          <Text>สถานะ</Text>
          <Select
            isInvalid={errors.status}
            errorBorderColor='crimson'
            defaultValue='pending'
            // placeholder='กรุณาเลือกสถานะ'
            {...register('status', { required: true })}
          >
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
          <Text>เลข ก</Text>
          <Input placeholder='กรุณากรอกเลข ก' {...register('evidenceId')} />
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
          {renderStationOptions()}
          <Text>เลขหนังสือนำส่ง</Text>
          <Input
            placeholder='กรุณากรอกเลขหนังสือนำส่ง'
            {...register('packageId')}
          />
          <Text>ลงวันที่</Text>
          <DatePicker
            locale='th-TH'
            onChange={(date) => setPackageDate(date)}
            value={packageDate}
          />
          <Text>พนักงานสอบสวน</Text>
          <Input
            placeholder='กรุณากรอกชื่อพนักงานสอบสวน'
            {...register('detectiveName')}
          />
          <Text>หมายเลขโทรศัพท์พนักงานสอบสวน</Text>
          <Input
            placeholder='กรุณากรอกหมายเลขโทรศัพท์'
            {...register('detectivePhone')}
          />
          <Text>รายการของกลาง</Text>
          <Textarea
            placeholder='รายการของกลาง'
            {...register('itemsDescription')}
          />
          <Text>ตู้</Text>
          <Input placeholder='กรุณากรอกตู้' {...register('storedAt')} />
          <Text>เทคนิค</Text>
          <CheckboxGroup
            onChange={(value) => setTechniques(value)}
            placeholder='กรุณาเลือกเทคนิค'
            isInvalid={errors.technique}
            errorBorderColor='crimson'
            value={techniques}
          >
            <HStack>
              <Checkbox value='Superglue'>Superglue</Checkbox>
              <Checkbox value='R6G'>R6G</Checkbox>
              <Checkbox value='BY40'>BY40</Checkbox>
              <Checkbox value='Ninhydrin'>Ninhydrin</Checkbox>
              <Checkbox value='Indanedione'>Indanedione</Checkbox>
              <Checkbox value='Indanedione (thermal)'>
                Indanedione (thermal)
              </Checkbox>
              <Checkbox value='Sticky side'>Sticky side</Checkbox>
              <Checkbox value='Amidoblack '>Amidoblack </Checkbox>
              <Checkbox value='Powder'>Powder</Checkbox>
              <Checkbox value='etc'>อื่นๆ</Checkbox>
            </HStack>
          </CheckboxGroup>
          <Text>ร้อยเวร</Text>
          <Input placeholder='กรุณากรอกชื่อร้อยเวร' {...register('LTName')} />
          <Text>ผู้ช่วย</Text>
          <Input placeholder='ผู้ช่วย' defaultValue={auth?.fullName} disabled />
          <Text>ความสำคัญ</Text>
          <Select
            isInvalid={errors.important}
            errorBorderColor='crimson'
            placeholder='กรุณาเลือกความสำคัญ'
            defaultValue='normal'
            {...register('important', { required: true })}
          >
            <option value='normal'>ทั่วไป (ไม่มีความสำคัญ)</option>
            <option value='politic'>การเมือง</option>
            <option value='drugs'>ยาเสพติด</option>
            <option value='media'>สื่อสนใจ</option>
            <option value='vip'>เกี่ยวข้องกับบุคคลสำคัญ</option>
          </Select>
          <Text>หมายเหตุ</Text>
          <Textarea
            placeholder='กรุณาระบุหมายเหตุ (หากมี)'
            {...register('remark')}
          />
          <Button colorScheme='blue' type='submit'>
            ยืนยัน
          </Button>
        </VStack>
      </form>
    </Container>
  );
}

export default EditEvidence;
