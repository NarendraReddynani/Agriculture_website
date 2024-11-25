import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  VStack,
  HStack,
  Heading,
} from '@chakra-ui/react';
import { api } from '../api'; // Replace with your API configuration
import axios from 'axios';

const config = {
  cUrl: 'https://api.countrystatecity.in/v1/countries',
  ckey: 'NHhvOEcyWk50N2Vna3VFTE00bFp3MjFKR0ZEOUhkZlg4RTk1MlJlaA==',
};

const machineryOptions = [
  'Plough',
  'Tractor',
  'Thresher',
  'Rake',
  'Sprayer Pumps',
  'Wheelbarrow',
  'Seeder & Fertilizer',
  'Trolley Pump',
];

const farmingTypeOptions = [
  { value: 'organic', label: 'Organic Farming' },
  { value: 'traditional', label: 'Traditional Farming' },
  { value: 'modern', label: 'Modern Farming' },
  { value: 'hydroponics', label: 'Hydroponics' },
  { value: 'aquaculture', label: 'Aquaculture' },
];

const wageOptions = [
  '0 - 500',
  '501 - 1000',
  '1001 - 1500',
  '1501 - 30000',
];

const HelperForm = () => {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [pincode, setPincode] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [wages, setWages] = useState('');
  const [selectedMachinery, setSelectedMachinery] = useState('');
  const [selectedFarmingType, setSelectedFarmingType] = useState('');

  useEffect(() => {
    const fetchCountries = async () => {
      const response = await fetch(config.cUrl, {
        headers: { 'X-CSCAPI-KEY': config.ckey },
      });
      const data = await response.json();
      setCountries(data);
    };

    fetchCountries();
  }, []);

  useEffect(() => {
    const fetchStates = async () => {
      if (selectedCountry) {
        const response = await fetch(
          `https://api.countrystatecity.in/v1/countries/${selectedCountry}/states`,
          {
            headers: { 'X-CSCAPI-KEY': config.ckey },
          }
        );
        const data = await response.json();
        setStates(data);
      }
    };

    fetchStates();
  }, [selectedCountry]);

  useEffect(() => {
    const fetchCities = async () => {
      if (selectedState) {
        const response = await fetch(
          `https://api.countrystatecity.in/v1/countries/${selectedCountry}/states/${selectedState}/cities`,
          {
            headers: { 'X-CSCAPI-KEY': config.ckey },
          }
        );
        const data = await response.json();
        setCities(data);
      }
    };

    fetchCities();
  }, [selectedState]);

  const handleCountryChange = (e) => {
    setSelectedCountry(e.target.value);
    setSelectedState('');
    setSelectedCity('');
    setStates([]);
    setCities([]);
  };

  const handleStateChange = (e) => {
    setSelectedState(e.target.value);
    setSelectedCity('');
    setCities([]);
  };

  const handleCityChange = (e) => {
    setSelectedCity(e.target.value);
  };

  const handleMachineryChange = (e) => {
    setSelectedMachinery(e.target.value);
  };

  const handleFarmingTypeChange = (e) => {
    setSelectedFarmingType(e.target.value);
  };

  const handleWagesChange = (e) => {
    setWages(e.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedCountry || !selectedState || !selectedCity || !pincode || !name || !age || !gender || !mobileNumber || !wages || !selectedFarmingType) {
      alert('Please fill in all required fields.');
      return;
    }

    const payload = {
      country: selectedCountry,
      state: selectedState,
      city: selectedCity,
      pincode,
      name,
      age,
      mobilenumber: mobileNumber,
      gender,
      wages,
      farmingType: selectedFarmingType,
      machinery: selectedMachinery,
    };

    try {
      const response = await axios.post(`${api}/helpers`, payload);
      if (response.data) {
        alert('Helper added successfully!');
        resetFormFields(); // Reset the form fields after successful submission
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to add helper. Please try again.';
      alert(errorMessage);
    }
  };

  const resetFormFields = () => {
    setSelectedCountry('');
    setSelectedState('');
    setSelectedCity('');
    setPincode('');
    setName('');
    setAge('');
    setGender('');
    setMobileNumber('');
    setWages('');
    setSelectedMachinery('');
    setSelectedFarmingType('');
    setStates([]);
    setCities([]);
  };

  return (
    <Box maxW="lg" mx="auto" mt={10} p={6} bg="white" borderRadius="lg" boxShadow="lg" border="1px solid" borderColor="blue.300">
      <Heading as="h2" size="lg" mb={6} color="blue.500" textAlign="center">
        Add New Helper
      </Heading>
      <VStack as="form" spacing={4} onSubmit={handleSubmit}>
        <FormControl isRequired>
          <HStack>
            <FormLabel color="blue.600" minW="150px">
              Country
            </FormLabel>
            <Select placeholder="Select Country" value={selectedCountry} onChange={handleCountryChange}>
              {countries.map((country) => (
                <option key={country.iso2} value={country.iso2}>
                  {country.name}
                </option>
              ))}
            </Select>
          </HStack>
        </FormControl>

        <FormControl isRequired>
          <HStack>
            <FormLabel color="blue.600" minW="150px">
              State
            </FormLabel>
            <Select placeholder="Select State" value={selectedState} onChange={handleStateChange} isDisabled={!selectedCountry}>
              {states.map((state) => (
                <option key={state.iso2} value={state.iso2}>
                  {state.name}
                </option>
              ))}
            </Select>
          </HStack>
        </FormControl>

        <FormControl isRequired>
          <HStack>
            <FormLabel color="blue.600" minW="150px">
              City
            </FormLabel>
            <Select placeholder="Select City" value={selectedCity} onChange={handleCityChange} isDisabled={!selectedState}>
              {cities.map((city) => (
                <option key={city.name} value={city.name}>
                  {city.name}
                </option>
              ))}
            </Select>
          </HStack>
        </FormControl>

        <FormControl isRequired>
          <HStack>
            <FormLabel color="blue.600" minW="150px">
              Pincode
            </FormLabel>
            <Input type="text" value={pincode} onChange={(e) => setPincode(e.target.value)} required />
          </HStack>
        </FormControl>

        <FormControl isRequired>
          <HStack>
            <FormLabel color="blue.600" minW="150px">
              Name
            </FormLabel>
            <Input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
          </HStack>
        </FormControl>

        <FormControl isRequired>
          <HStack>
            <FormLabel color="blue.600" minW="150px">
              Age
            </FormLabel>
            <Input type="number" value={age} onChange={(e) => setAge(e.target.value)} required />
          </HStack>
        </FormControl>

        <FormControl isRequired>
          <HStack>
            <FormLabel color="blue.600" minW="150px">
              Gender
            </FormLabel>
            <Select placeholder="Select Gender" value={gender} onChange={(e) => setGender(e.target.value)} required>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </Select>
          </HStack>
        </FormControl>

        <FormControl isRequired>
          <HStack>
            <FormLabel color="blue.600" minW="150px">
              Mobile Number
            </FormLabel>
            <Input type="text" value={mobileNumber} onChange={(e) => setMobileNumber(e.target.value)} required />
          </HStack>
        </FormControl>

        <FormControl isRequired>
          <HStack>
            <FormLabel color="blue.600" minW="150px">
              Wages
            </FormLabel>
            <Select placeholder="Select Wages" value={wages} onChange={handleWagesChange} required>
              {wageOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </Select>
          </HStack>
        </FormControl>

        <FormControl>
          <HStack>
            <FormLabel color="blue.600" minW="150px">
              Machinery
            </FormLabel>
            <Select placeholder="Select Machinery" value={selectedMachinery} onChange={handleMachineryChange}>
              {machineryOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </Select>
          </HStack>
        </FormControl>

        <FormControl isRequired>
          <HStack>
            <FormLabel color="blue.600" minW="150px">
              Farming Type
            </FormLabel>
            <Select placeholder="Select Farming Type" value={selectedFarmingType} onChange={handleFarmingTypeChange} required>
              {farmingTypeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </HStack>
        </FormControl>

        <Button type="submit" colorScheme="blue" size="lg" width="full">
          Add Helper
        </Button>
      </VStack>
    </Box>
  );
};

export default HelperForm;
