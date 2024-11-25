import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { api } from '../api.js';
import {
  Box,
  Button,
  Input,
  FormControl,
  FormLabel,
  Stack,
  Image,
  Text,
  Grid,
  GridItem,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from '@chakra-ui/react';

const ProductForm = () => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [rating, setRating] = useState('');
  const [postlink, setPostlink] = useState('');
  const [image, setImage] = useState(null);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    axios.get(`${api}/products`)
      .then((response) => setProducts(response.data))
      .catch((error) => console.error('Error fetching products:', error));
  }, []);

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    let imageBase64 = '';
    if (image) {
      imageBase64 = await convertToBase64(image);
    }

    const productData = { name, price, rating, postlink, postImage: imageBase64 };

    try {
      const response = await axios.post(`${api}/products`, productData);
      console.log(response.data);
      alert('Product uploaded successfully!');
      setName('');
      setPrice('');
      setRating('');
      setPostlink('');
      setImage(null);
    } catch (error) {
      console.error('Error uploading product:', error);
      alert('Failed to upload product.');
    }
  };

  const handleUpdateClick = (product) => {
    setSelectedProduct(product);
    setName(product.name);
    setPrice(product.price);
    setRating(product.rating);
    setPostlink(product.postlink);
    onOpen();
  };

  const handleUpdateSubmit = async () => {
    let imageBase64 = '';
    if (image) {
      imageBase64 = await convertToBase64(image);
    }

    const productData = { name, price, rating, postlink, postImage: imageBase64 };

    try {
      await axios.put(`${api}/products/update/${selectedProduct._id}`, productData);
      alert('Product updated successfully!');
      onClose();
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Failed to update product.');
    }
  };

  const handleDelete = async (productId) => {
    try {
      await axios.delete(`${api}/products/delete/${productId}`);
      alert('Product deleted successfully!');
      setProducts(products.filter((product) => product._id !== productId));
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product.');
    }
  };

  return (
    <Box maxW="md" mx="auto" mt={8}>
      <form onSubmit={handleUpload}>
        <FormControl mb={4}>
          <FormLabel>Name</FormLabel>
          <Input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </FormControl>
        <FormControl mb={4}>
          <FormLabel>Price</FormLabel>
          <Input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
        </FormControl>
        <FormControl mb={4}>
          <FormLabel>Rating</FormLabel>
          <Input type="number" value={rating} onChange={(e) => setRating(e.target.value)} required />
        </FormControl>
        <FormControl mb={4}>
          <FormLabel>Post Link</FormLabel>
          <Input type="text" value={postlink} onChange={(e) => setPostlink(e.target.value)} required />
        </FormControl>
        <FormControl mb={4}>
          <FormLabel>Upload Image</FormLabel>
          <Input type="file" accept="image/*" onChange={handleFileChange} />
        </FormControl>
        <Button type="submit" colorScheme="blue" width="full">
          Upload Product
        </Button>
      </form>

      <Stack mt={8}>
  <Grid templateColumns="repeat(4, 1fr)" gap={6}>
    {products.map((product) => (
      <Box
        key={product._id}
        p={6}
        shadow="md"
        borderWidth="1px"
        borderRadius="lg"
        transition="transform 0.3s, box-shadow 0.3s"
        _hover={{ transform: 'scale(1.02)', boxShadow: '2xl' }}
        bg="white"
      >
        <Stack spacing={4} align="center">
          {product.postImage && (
            <Image
              src={product.postImage}
              alt={product.name}
              boxSize="150px"
              objectFit="cover"
              borderRadius="md"
              shadow="lg"
            />
          )}
          <Text fontWeight="bold">{product.name}</Text>
          <Text>Price: ${product.price}</Text>
          <Text>Rating: {product.rating}</Text>
          <Button colorScheme="teal" onClick={() => handleUpdateClick(product)}>
            Update
          </Button>
          <Button colorScheme="red" onClick={() => handleDelete(product._id)}>
            Delete
          </Button>
        </Stack>
      </Box>
    ))}
  </Grid>
</Stack>


      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Update Product</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={4}>
              <FormLabel>Name</FormLabel>
              <Input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Price</FormLabel>
              <Input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Rating</FormLabel>
              <Input type="number" value={rating} onChange={(e) => setRating(e.target.value)} required />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Post Link</FormLabel>
              <Input type="text" value={postlink} onChange={(e) => setPostlink(e.target.value)} required />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Upload Image</FormLabel>
              <Input type="file" accept="image/*" onChange={handleFileChange} />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleUpdateSubmit}>
              Submit
            </Button>
            <Button variant="ghost" onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default ProductForm;
