import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Heading,
  VStack,
  useToast,
  Text,
} from '@chakra-ui/react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SignupPage = () => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const toast = useToast();
  const nav = useNavigate();

  const handleSendOtp = async () => {
    if (mobile.length === 10) {
      try {
        const response = await axios.post('http://localhost:9000/check-mobile', {
          mobilenumber: mobile,
        });
        if (response.data.exists) {
          toast({
            title: 'Mobile Number Exists',
            description: 'This mobile number is already registered.',
            status: 'error',
            duration: 3000,
            isClosable: true,
          });
        } else {
          setIsOtpSent(true);
          toast({
            title: 'OTP Sent!',
            description: 'Please check your mobile for the OTP.',
            status: 'success',
            duration: 3000,
            isClosable: true,
          });
        }
      } catch (error) {
        toast({
          title: 'Error',
          description: 'An error occurred while checking the mobile number.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } else {
      toast({
        title: 'Invalid Mobile Number',
        description: 'Please enter a valid 10-digit mobile number.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleVerifyOtp = () => {
    if (otp === '1234') { // Replace this with your actual OTP verification logic
      setIsVerified(true);
      toast({
        title: 'Verification Successful',
        description: 'Your mobile number has been verified.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } else {
      toast({
        title: 'Invalid OTP',
        description: 'Please enter the correct OTP.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleSignup = async () => {
    if (name && age && gender && mobile && password && isVerified) {
      try {
        const response = await axios.post('http://localhost:9000/signup', {
          name,
          age,
          gender,
          mobilenumber: mobile,
          password,
        });

        if (response.data.error) {
          toast({
            title: 'Error',
            description: response.data.error,
            status: 'error',
            duration: 3000,
            isClosable: true,
          });
        } else {
          toast({
            title: 'Signup Successful!',
            description: 'Your account has been created successfully.',
            status: 'success',
            duration: 3000,
            isClosable: true,
          });
          nav("/signin");
        }
      } catch (error) {
        toast({
          title: 'Signup Failed',
          description: 'An error occurred during signup. Please try again.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } else {
      toast({
        title: 'Incomplete Form',
        description: 'Please fill all fields and verify your mobile number.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box bg="green.50" minH="100vh" display="flex" alignItems="center" justifyContent="center" px={4}>
      <VStack
        bg="white"
        p={8}
        borderRadius="lg"
        boxShadow="lg"
        maxW="400px"
        w="full"
        spacing={5}
      >
        <Heading as="h2" size="lg" color="green.600">
          Sign Up
        </Heading>
        <FormControl id="name" isRequired>
          <FormLabel>Name</FormLabel>
          <Input
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            focusBorderColor="green.500"
          />
        </FormControl>
        <FormControl id="age" isRequired>
          <FormLabel>Age</FormLabel>
          <Input
            type="number"
            placeholder="Enter your age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            focusBorderColor="green.500"
          />
        </FormControl>
        <FormControl id="gender" isRequired>
          <FormLabel>Gender</FormLabel>
          <Select
            placeholder="Select your gender"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            focusBorderColor="green.500"
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </Select>
        </FormControl>
        <FormControl id="mobile" isRequired>
          <FormLabel>Mobile Number</FormLabel>
          <Input
            type="tel"
            placeholder="Enter your 10-digit mobile number"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            focusBorderColor="green.500"
            maxLength={10}
          />
          {isOtpSent && (
            <Input
              mt={4}
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              focusBorderColor="green.500"
            />
          )}
          {!isOtpSent ? (
            <Button mt={4} colorScheme="green" onClick={handleSendOtp}>
              Send OTP
            </Button>
          ) : !isVerified ? (
            <Button mt={4} colorScheme="green" onClick={handleVerifyOtp}>
              Verify OTP
            </Button>
          ) : (
            <Button mt={4} colorScheme="green" isDisabled>
              Verified
            </Button>
          )}
        </FormControl>
        <FormControl id="password" isRequired>
          <FormLabel>Password</FormLabel>
          <Input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            focusBorderColor="green.500"
          />
        </FormControl>
        <Button
          colorScheme="green"
          w="full"
          onClick={handleSignup}
          isDisabled={!isVerified}
        >
          Sign Up
        </Button>
        <Text>
          Already have an account?{' '}
          <a href="/signin" style={{ color: 'green', textDecoration: 'underline' }}>
            Sign in
          </a>
        </Text>
      </VStack>
    </Box>
  );
};

export default SignupPage;
