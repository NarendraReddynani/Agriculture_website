import React, { useState } from 'react';
import {
    Box,
    Button,
    Container,
    FormControl,
    FormLabel,
    Input,
    Text,
    VStack,
    HStack,
    Heading,
    Icon,
    Alert,
    AlertIcon,
    useToast,
} from '@chakra-ui/react';
import { WiDaySunny, WiCloudy, WiRain, WiSnow, WiFog } from 'react-icons/wi'; // You can add more icons for different weather conditions

const apiKey = "8a75a26a162f74f8281ebed8810ca2e7";

const WeatherApp = () => {
    const [city, setCity] = useState('');
    const [weatherData, setWeatherData] = useState(null);
    const [error, setError] = useState('');
    const toast = useToast();

    const getWeatherData = async (city) => {
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
        const res = await fetch(apiUrl);
        if (!res.ok) {
            throw new Error("Could not fetch data");
        }
        return await res.json();
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (city) {
            try {
                const data = await getWeatherData(city);
                displayWeatherInfo(data);
            } catch (error) {
                setError(error.message);
                toast({
                    title: "Error",
                    description: error.message,
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                });
            }
        } else {
            setError("Please enter the city");
        }
    };

    const displayWeatherInfo = (data) => {
        const { name: city, main: { temp, humidity }, weather: [{ description, id }] } = data;
        setWeatherData({
            city,
            temp: (temp - 273.15).toFixed(1),
            humidity,
            description,
            emoji: getWeatherEmoji(id),
        });
        setError('');
    };

    const getWeatherEmoji = (weatherId) => {
        switch (true) {
            case (weatherId >= 200 && weatherId < 300):
                return <Icon as={WiFog} boxSize={8} color="gray.600" />;
            case (weatherId >= 300 && weatherId < 400):
                return <Icon as={WiRain} boxSize={8} color="blue.400" />;
            case (weatherId >= 500 && weatherId < 600):
                return <Icon as={WiRain} boxSize={8} color="blue.600" />;
            case (weatherId >= 600 && weatherId < 700):
                return <Icon as={WiSnow} boxSize={8} color="white" />;
            case (weatherId >= 700 && weatherId < 800):
                return <Icon as={WiFog} boxSize={8} color="gray.400" />;
            case (weatherId === 800):
                return <Icon as={WiDaySunny} boxSize={8} color="yellow.400" />;
            case (weatherId > 800 && weatherId <= 810):
                return <Icon as={WiCloudy} boxSize={8} color="gray.300" />;
            default:
                return <Icon as={WiDaySunny} boxSize={8} color="orange.400" />;
        }
    };

    return (
        <Container centerContent>
            <Box
                bg="teal.500"
                p={6}
                borderRadius="md"
                boxShadow="lg"
                mb={4}
                w="full"
            >
                <Heading color="white">Weather App</Heading>
            </Box>
            <form onSubmit={handleSubmit}>
                <FormControl mb={4}>
                    <FormLabel color="teal.700">Enter City</FormLabel>
                    <Input
                        type="text"
                        placeholder="City Name"
                        className="cityInput"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                    />
                </FormControl>
                <Button type="submit" colorScheme="teal" w="full">Get Weather</Button>
            </form>

            {error && (
                <Alert status="error" mt={4}>
                    <AlertIcon />
                    {error}
                </Alert>
            )}

            {weatherData && (
                <VStack
                    mt={6}
                    spacing={4}
                    p={5}
                    borderRadius="md"
                    boxShadow="md"
                    bg="white"
                    w="full"
                    maxW="md"
                >
                    <Text fontSize="2xl" fontWeight="bold">{weatherData.city}</Text>
                    <Text fontSize="3xl" color="teal.500">{weatherData.temp}°C</Text>
                    <Text fontSize="lg">Humidity: {weatherData.humidity}%</Text>
                    <Text fontSize="lg">{weatherData.description}</Text>
                    <Box>{weatherData.emoji}</Box>
                </VStack>
            )}
        </Container>
    );
};

export default WeatherApp;
