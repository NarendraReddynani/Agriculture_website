import { Box, FormControl, FormLabel, Input, Button, Heading, Flex, Text } from "@chakra-ui/react";
import axios from 'axios';
import { useState } from "react";
import { api } from "../api"; // Adjust this import based on your project structure
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const SignIn = ({ handleLoginSuccess }) => {
    const [mobilenumber, setMobilenumber] = useState('');
    const [password, setPassword] = useState('');
    const nav = useNavigate();
    const [messages, setMessages] = useState([]);

    const addMessage = async (newMessage) => {
        try {
          const response = await axios.post(`${api}/user/${mobilenumber}/messages`, { message: newMessage });
          setMessages((prevMessages) => [...prevMessages, response.data]);
        } catch (error) {
          console.error('Error adding message:', error);
          setError('Could not add message.');
        }
      };

    const Signin = async () => {
        try {
            const res = await axios.post(api + "/signin", { mobilenumber, password });

            if (res.data.message) {
                handleLoginSuccess(res.data.values);
                sessionStorage.auth=JSON.stringify(res?.data?.values);
                addMessage(res.data.message);
                alert("Login successfully");
                nav("/"); // Navigate to the home page
            } else if (res.data.error) {
                if (res.data.error === "user not found. Please sign up.") {
                    alert("User not found. Please sign up.");
                    window.location.href = "/signup"; // Redirect to signup page if user is not found
                } else if (res.data.error === "Incorrect password. Please try again.") {
                    alert("Incorrect password. Please try again.");
                } else {
                    alert("An error occurred during login. Please try again later.");
                }
            }
        } catch (e) {
            console.log(e);
            alert("An error occurred while attempting to sign in. Please try again later.");
        }
    };

    return (
        <Flex height="100vh" alignItems="center" justifyContent="center">
            {/* Login Form Section */}
            <Box
                width={{ base: "100%", sm: "400px", md: "500px" }}
                p={8}
                borderWidth={1}
                borderRadius="md"
                boxShadow="lg"
            >
                <Heading as="h2" size="xl" mb={6} textAlign="center">
                    Sign In
                </Heading>
                <FormControl id="mobilenumber" mb={4}>
                    <FormLabel>Mobile Number</FormLabel>
                    <Input
                        type="text"
                        placeholder="Enter your mobile number"
                        value={mobilenumber}
                        onChange={(e) => setMobilenumber(e.target.value)}
                        required
                    />
                </FormControl>
                <FormControl id="password" mb={4}>
                    <FormLabel>Password</FormLabel>
                    <Input
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </FormControl>
                <Button
                    colorScheme="teal"
                    width="full"
                    onClick={Signin}
                >
                    Sign In
                </Button>
                <Text textAlign="center" mt={4}>
                    Don't have an account?{" "}
                    <Link to="/signup" style={{ color: "teal" }}>
                        Sign Up
                    </Link>
                </Text>
            </Box>
        </Flex>
    );
};

export default SignIn;
