import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Text,
  Textarea,
  useToast,
  VStack,
  HStack,
} from '@chakra-ui/react';

export const AdminDashboard = () => {
  const [cropName, setCropName] = useState('');
  const [region, setRegion] = useState('');
  const [cropType, setCropType] = useState('');
  const [currentPrice, setCurrentPrice] = useState('');
  const [priceChange, setPriceChange] = useState('');
  const [marketLocation, setMarketLocation] = useState('');
  const [supply, setSupply] = useState('');
  const [demand, setDemand] = useState('');
  const [harvestingPeriod, setHarvestingPeriod] = useState('');
  const [qualityIndicators, setQualityIndicators] = useState('');
  const [projectedPrices, setProjectedPrices] = useState('');
  const [comparison, setComparison] = useState('');
  const [error, setError] = useState('');
  const toast = useToast();

  // Function to validate form inputs
  const validateInputs = () => {
    if (!cropName || !region || !cropType || !currentPrice) {
      return 'All crop fields are required!';
    }
    if (isNaN(currentPrice) || currentPrice <= 0) {
      return 'Current price must be a positive number!';
    }
    return '';
  };

  // Handle crop details submission
  const handleCropSubmit = async (event) => {
    event.preventDefault();

    const validationError = validateInputs();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError('');

    const cropData = {
      cropName,
      region,
      cropType,
      currentPrice: parseFloat(currentPrice),
      priceChange,
      marketLocation,
      supply,
      demand,
      harvestingPeriod,
      qualityIndicators,
      projectedPrices,
      comparison,
    };

    try {
      const response = await fetch('http://localhost:9000/api/crop-details', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cropData),
      });

      if (!response.ok) {
        throw new Error('Failed to save crop details');
      }

      toast({
        title: 'Success',
        description: 'Crop details added successfully.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      // Reset crop fields
      setCropName('');
      setRegion('');
      setCropType('');
      setCurrentPrice('');
      setPriceChange('');
      setMarketLocation('');
      setSupply('');
      setDemand('');
      setHarvestingPeriod('');
      setQualityIndicators('');
      setProjectedPrices('');
      setComparison('');
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <HStack spacing={8} p={5} maxWidth="1200px" mx="auto" align="stretch">
      <Box flex="1" p={5} borderWidth={1} borderRadius="md" boxShadow="md">
        <Text fontSize="2xl" fontWeight="bold">Enter Crop Details</Text>
        <form onSubmit={handleCropSubmit}>
          {error && <Text color="red.500">{error}</Text>}
          
          <FormControl isRequired>
            <FormLabel>Crop Name</FormLabel>
            <Input
              value={cropName}
              onChange={(e) => setCropName(e.target.value)}
              placeholder="Enter crop name"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Region</FormLabel>
            <Input
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              placeholder="Enter region"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Type of Crop</FormLabel>
            <Input
              value={cropType}
              onChange={(e) => setCropType(e.target.value)}
              placeholder="Enter crop type"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Current Price (in ₹)</FormLabel>
            <Input
              type="number"
              value={currentPrice}
              onChange={(e) => setCurrentPrice(e.target.value)}
              placeholder="Enter current price"
            />
          </FormControl>

          <FormControl>
            <FormLabel>Price Change</FormLabel>
            <Input
              value={priceChange}
              onChange={(e) => setPriceChange(e.target.value)}
              placeholder="Enter price change"
            />
          </FormControl>

          <FormControl>
            <FormLabel>Market Location</FormLabel>
            <Input
              value={marketLocation}
              onChange={(e) => setMarketLocation(e.target.value)}
              placeholder="Enter market location"
            />
          </FormControl>

          <FormControl>
            <FormLabel>Supply</FormLabel>
            <Input
              value={supply}
              onChange={(e) => setSupply(e.target.value)}
              placeholder="Enter current supply"
            />
          </FormControl>

          <FormControl>
            <FormLabel>Demand</FormLabel>
            <Input
              value={demand}
              onChange={(e) => setDemand(e.target.value)}
              placeholder="Enter current demand"
            />
          </FormControl>

          <FormControl>
            <FormLabel>Harvesting Period</FormLabel>
            <Input
              value={harvestingPeriod}
              onChange={(e) => setHarvestingPeriod(e.target.value)}
              placeholder="Enter harvesting period"
            />
          </FormControl>

          <FormControl>
            <FormLabel>Quality Indicators</FormLabel>
            <Textarea
              value={qualityIndicators}
              onChange={(e) => setQualityIndicators(e.target.value)}
              placeholder="Enter quality indicators"
            />
          </FormControl>

          <FormControl>
            <FormLabel>Projected Prices</FormLabel>
            <Input
              value={projectedPrices}
              onChange={(e) => setProjectedPrices(e.target.value)}
              placeholder="Enter projected prices"
            />
          </FormControl>

          <FormControl>
            <FormLabel>Comparison</FormLabel>
            <Textarea
              value={comparison}
              onChange={(e) => setComparison(e.target.value)}
              placeholder="Enter comparison data"
            />
          </FormControl>

          <Button mt={4} colorScheme="teal" type="submit" width="full">
            Add Crop Details
          </Button>
        </form>
      </Box>
    </HStack>
  );
};

export default AdminDashboard;
