import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { api } from '../api';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Select,
  Input,
  VStack,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from '@chakra-ui/react';

const config = {
  cUrl: 'https://api.countrystatecity.in/v1/countries',
  ckey: 'NHhvOEcyWk50N2Vna3VFTE00bFp3MjFKR0ZEOUhkZlg4RTk1MlJlaA==',
};

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

const HelperSearch = () => {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedFarmingType, setSelectedFarmingType] = useState('');
  const [selectedWage, setSelectedWage] = useState('');
  const [age, setAge] = useState('');
  const [pincode, setPincode] = useState('');
  const [helpers, setHelpers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadCountries();
  }, []);

  const loadCountries = async () => {
    try {
      const response = await fetch(config.cUrl, {
        headers: { 'X-CSCAPI-KEY': config.ckey },
      });
      if (!response.ok) throw new Error('Failed to fetch countries');
      const data = await response.json();
      setCountries(data);
    } catch (error) {
      console.error('Error loading countries:', error);
      setError('Error loading countries');
    }
  };

  const loadStates = async (countryCode) => {
    try {
      const response = await fetch(`${config.cUrl}/${countryCode}/states`, {
        headers: { 'X-CSCAPI-KEY': config.ckey },
      });
      if (!response.ok) throw new Error('Failed to fetch states');
      const data = await response.json();
      setStates(data);
    } catch (error) {
      console.error('Error loading states:', error);
      setError('Error loading states');
    }
  };

  const loadCities = async (countryCode, stateCode) => {
    try {
      const response = await fetch(`${config.cUrl}/${countryCode}/states/${stateCode}/cities`, {
        headers: { 'X-CSCAPI-KEY': config.ckey },
      });
      if (!response.ok) throw new Error('Failed to fetch cities');
      const data = await response.json();
      setCities(data);
    } catch (error) {
      console.error('Error loading cities:', error);
      setError('Error loading cities');
    }
  };

  const handleCountryChange = (e) => {
    const selectedCountryCode = e.target.value;
    setSelectedCountry(selectedCountryCode);
    setSelectedState('');
    setSelectedCity('');
    setStates([]);
    setCities([]);
    loadStates(selectedCountryCode);
  };

  const handleStateChange = (e) => {
    const selectedStateCode = e.target.value;
    setSelectedState(selectedStateCode);
    setSelectedCity('');
    setCities([]);
    loadCities(selectedCountry, selectedStateCode);
  };

  const handleSearch = async () => {
    setLoading(true);
  
    try {
      const response = await axios.get(`${api}/helpers/${pincode}`);
      const fetchedHelpers = response.data;
  
      const filteredHelpers = fetchedHelpers.filter(helper => {
        return (
          (!selectedCountry || helper.Country === selectedCountry) &&
          (!selectedState || helper.State === selectedState) &&
          (!selectedCity || helper.City === selectedCity) &&
          (!selectedFarmingType || helper.FarmingType === selectedFarmingType) &&
          (!selectedWage || helper.Wages === selectedWage) &&
          (!age || helper.Age === age)
        );
      });
  
      setHelpers(filteredHelpers);
      if (filteredHelpers.length === 0) {
        alert('No matching helpers found');
      }
    } catch (error) {
      console.error('Error fetching helpers:', error);
      alert('An error occurred while fetching the helpers.');
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <Box maxW="md" mx="auto" mt={10} p={6} bg="white" borderRadius="lg" boxShadow="lg" border="1px solid" borderColor="orange.300">
      <Heading as="h2" size="lg" mb={6} color="green.500" textAlign="center">
        Search Helpers
      </Heading>
      <VStack spacing={4}>
        <FormControl>
          <FormLabel>Country</FormLabel>
          <Select placeholder="Select country" value={selectedCountry} onChange={handleCountryChange}>
            {countries.map((country) => (
              <option key={country.iso2} value={country.iso2}>
                {country.name}
              </option>
            ))}
          </Select>
        </FormControl>
        <FormControl>
          <FormLabel>State</FormLabel>
          <Select placeholder="Select state" value={selectedState} onChange={handleStateChange}>
            {states.map((state) => (
              <option key={state.iso2} value={state.iso2}>
                {state.name}
              </option>
            ))}
          </Select>
        </FormControl>
        <FormControl>
          <FormLabel>City</FormLabel>
          <Select placeholder="Select city" value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)}>
            {cities.map((city) => (
              <option key={city.name} value={city.name}>
                {city.name}
              </option>
            ))}
          </Select>
        </FormControl>
        <FormControl>
          <FormLabel>Farming Type</FormLabel>
          <Select placeholder="Select farming type" value={selectedFarmingType} onChange={(e) => setSelectedFarmingType(e.target.value)}>
            {farmingTypeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </FormControl>
        <FormControl>
          <FormLabel>Wages</FormLabel>
          <Select placeholder="Select wages" value={selectedWage} onChange={(e) => setSelectedWage(e.target.value)}>
            {wageOptions.map((wage) => (
              <option key={wage} value={wage}>
                {wage}
              </option>
            ))}
          </Select>
        </FormControl>
        <FormControl>
          <FormLabel>Age</FormLabel>
          <Input type="text" value={age} onChange={(e) => setAge(e.target.value)} placeholder="Enter age" />
        </FormControl>
        <FormControl>
          <FormLabel>Pincode</FormLabel>
          <Input type="text" value={pincode} onChange={(e) => setPincode(e.target.value)} placeholder="Enter pincode" />
        </FormControl>
        <Button colorScheme="green" onClick={handleSearch} isLoading={loading}>
          Search
        </Button>
      </VStack>

      {error && <Box color="red.500" mt={4}>{error}</Box>}
      {helpers.length > 0 && (
        <Box mt={6}>
          <Heading as="h3" size="md" mb={4} color="green.500">
            Helper Details
          </Heading>
          <Table variant="simple" size="md">
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>Age</Th>
                <Th>Mobile Number</Th>
                <Th>Gender</Th>
                <Th>Wages</Th>
                <Th>FarmingType</Th>
              </Tr>
            </Thead>
            <Tbody>
              {helpers.map((helper) => (
                <Tr key={helper._id}>
                  <Td>{helper.Name}</Td>
                  <Td>{helper.Age}</Td>
                  <Td>{helper.Mobilenumber}</Td>
                  <Td>{helper.Gender}</Td>
                  <Td>{helper.Wages}</Td>
                  <Td>{helper.FarmingType}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      )}
    </Box>
  );
};

export default HelperSearch;
