import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Heading,
  Text,
  Stack,
  IconButton,
  useColorModeValue,
  SimpleGrid,
  Image,
  Flex,
  Select,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import logo from "./Agromarket.jpg";
import SignIn from "./signin/signin";

export const LandingPage = () => {
  const bgColor = useColorModeValue("gray.100", "gray.800");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    // Retrieve user details from session storage on component mount
    const storedUserProfile = sessionStorage.getItem("userProfile");
    if (storedUserProfile) {
      setUserProfile(JSON.parse(storedUserProfile));
      setIsLoggedIn(true);
    }
  }, []);

  const handleLoginSuccess = (userDetails) => {
    // Store user details in session storage as a JSON string
    sessionStorage.setItem("userProfile", JSON.stringify(userDetails));
    setUserProfile(userDetails);
    setIsLoggedIn(true);
    navigate("/"); // Navigate to home page after successful login
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserProfile({});
    sessionStorage.removeItem("userProfile");
    navigate('/');
  };

  return (
    <Box bg={bgColor} minH="100vh" py={10} px={5}>
      {/* Header Section */}
      <Header
        isLoggedIn={isLoggedIn}
        userProfile={userProfile}
        setIsLoggedIn={setIsLoggedIn}
        onLogout={handleLogout}
      />

      {/* Display user details if logged in */}
      {isLoggedIn && (
        <Box textAlign="center" mb={8}>
          <Heading as="h2" size="lg">
            Welcome back, {userProfile.name}!
          </Heading>
          <Text>Phone: {userProfile.phoneNumber}</Text>
          <Text>Gender: {userProfile.gender}</Text>
        </Box>
      )}

      {/* Main Content */}
      <Box textAlign="center" mb={8}>
        <Heading as="h1" size={{ base: "xl", md: "2xl" }} mb={4}>
          Welcome to AgroMarket
        </Heading>
        <Text fontSize={{ base: "md", md: "lg" }} color="gray.600">
          Empowering Farmers with Real-Time Market Insights
        </Text>
      </Box>

      {/* Feature Previews */}
      <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={10} mb={10}>
        <FeatureBox
          title="Real-Time Market Prices"
          description="Stay updated with current commodity prices."
          imageSrc="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTC_B3A3mwd247BkaAG6e8Ou4RLUtTfu5NIvQ&s"
        />
        <FeatureBox
          title="Commodity Alerts"
          description="Get instant notifications on market changes."
          imageSrc="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQbm14xxb-SuZaExZz8nqGsa0UBs1d35xhvxw&s"
        />
        <FeatureBox
          title="Market Insights"
          description="Understand market trends and make informed decisions."
          imageSrc="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ8T8uWi4AxeIsAeds2SD3moPGc_rFjW4Ltmw&s"
        />
      </SimpleGrid>

      {/* Sign In Component */}
      <SignIn handleLoginSuccess={handleLoginSuccess} />

      {/* Footer Section */}
      <Footer />
    </Box>
  );
};

// Header Component
const Header = ({ isLoggedIn, userProfile, onLogout }) => {
  const navigate = useNavigate();

  return (
    <Flex
      as="header"
      bg="teal.500"
      color="white"
      px={5}
      py={3}
      justify="space-between"
      align="center"
    >
      <Flex align="center">
        <Image src={logo} alt="AgroMarket Logo" boxSize="100px" mr={3} />
        <Heading as="h1" size="lg">
          AgroMarket
        </Heading>
      </Flex>

      <Stack direction={{ base: "column", md: "row" }} spacing={4} align="center">
        {!isLoggedIn ? (
          <>
            <Button colorScheme="teal" size="lg" mr={4} onClick={() => navigate("/signup")}>
              Sign Up
            </Button>
            <Button colorScheme="teal" size="lg" onClick={() => navigate("/signin")}>
              Log In
            </Button>
          </>
        ) : (
          <Menu>
            <MenuButton as={Button} colorScheme="teal" rightIcon={<ChevronDownIcon />}>
              {userProfile.name}
            </MenuButton>
            <MenuList>
              <MenuItem>Name: {userProfile.name}</MenuItem>
              <MenuItem>Phone: {userProfile.phoneNumber}</MenuItem>
              <MenuItem>Gender: {userProfile.gender}</MenuItem>
              <MenuItem onClick={onLogout}>Logout</MenuItem>
            </MenuList>
          </Menu>
        )}
        <Select width={{ base: "100%", md: "200px" }} placeholder="Select Language">
          <option value="en">English</option>
          <option value="hi">Hindi</option>
          <option value="ta">Tamil</option>
          <option value="bn">Bengali</option>
        </Select>
      </Stack>
    </Flex>
  );
};

// Footer Component
const Footer = () => {
  return (
    <Flex as="footer" justify="center" mt={10} py={5} bg="gray.700" color="white">
      <IconButton icon={<FaFacebook />} aria-label="Facebook" mx={2} />
      <IconButton icon={<FaTwitter />} aria-label="Twitter" mx={2} />
      <IconButton icon={<FaInstagram />} aria-label="Instagram" mx={2} />
    </Flex>
  );
};

// Feature Box Component
const FeatureBox = ({ title, description, imageSrc }) => {
  return (
    <Box p={5} shadow="md" borderWidth="1px" rounded="md" overflow="hidden" textAlign="center">
      <Image
        src={imageSrc}
        alt={title}
        width="100%"
        height="200px"
        objectFit="cover"
        borderRadius="md"
      />
      <Heading as="h4" size="md" mt={3}>
        {title}
      </Heading>
      <Text mt={2} color="gray.600">
        {description}
      </Text>
    </Box>
  );
};

export default LandingPage;
