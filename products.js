import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { api } from '../api.js';
import {
  Box,
  Button,
  Image,
  Text,
  VStack,
  Heading,
  SimpleGrid,
  Spinner,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';

const ProductsList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch products from the backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${api}/products`);
        setProducts(response.data);
      } catch (error) {
        setError('Error fetching products.');
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <Box textAlign="center" mt={20}>
        <Spinner size="xl" color="teal.500" />
        <Text mt={4}>Loading products...</Text>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert status="error" borderRadius="md" mt={4}>
        <AlertIcon />
        {error}
      </Alert>
    );
  }

  return (
    <Box mx="auto" mt={8} p={4} bg="green.200" minH="100vh">
      <Heading as="h1" size="2xl" textAlign="center" mb={8}>
        Products
      </Heading>
      <SimpleGrid columns={[1, 2, 3, 4]} spacing={6}>
        {products.map((product) => (
          <Box
            key={product._id}
            p={4}
            borderWidth="1px"
            borderRadius="xl"
            shadow="md"
            bg="white"
            transition="transform 0.3s, box-shadow 0.3s"
            _hover={{ transform: 'scale(1.05)', boxShadow: 'xl' }}
          >
            <VStack spacing={3} align="center">
              {product.postImage && (
                <Image
                  src={product.postImage}
                  alt={product.name}
                  boxSize="200px"
                  objectFit="cover"
                  borderRadius="md"
                  shadow="lg"
                  transition="box-shadow 0.3s"
                  _hover={{ boxShadow: '2xl' }}
                />
              )}
              <Text fontWeight="bold" fontSize="xl" textAlign="center">
                {product.name}
              </Text>
              <Text fontSize="lg" color="gray.700">
                Price: ${!isNaN(product.price) ? Number(product.price).toFixed(2) : 'N/A'}
              </Text>
              <Text fontSize="lg" color="gray.600">
                Rating: {product.rating || 'N/A'}
              </Text>
              <Button
                as="a"
                href={product.postlink}
                target="_blank"
                rel="noopener noreferrer"
                colorScheme="teal"
                size="lg"
                shadow="lg"
                transition="background-color 0.3s, transform 0.3s, box-shadow 0.3s"
                _hover={{
                  backgroundColor: 'teal.600',
                  transform: 'scale(1.05)',
                  boxShadow: '0 0 15px teal',
                }}
              >
                Buy
              </Button>
            </VStack>
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default ProductsList;
