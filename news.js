// src/News.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Box,
    Heading,
    Image,
    Text,
    VStack,
    Button,
    Spinner,
    Container,
    useBreakpointValue,
} from '@chakra-ui/react';

const News = () => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const apiKey = '9ef15a8f28624a11a3e00d9a57419f7e'; // Replace with your actual API key
    const apiUrl = `https://newsapi.org/v2/everything?q=agriculture&from=2024-09-17&sortBy=publishedAt&apiKey=${apiKey}`;

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const response = await axios.get(apiUrl);
                setArticles(response.data.articles.slice(0, 10)); // Get the top 10 articles
            } catch (error) {
                console.error("Error fetching the news:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchNews();
    }, [apiUrl]);

    if (loading) return <Spinner size="xl" />;

    return (
        <Container maxW="container.md" py={5} bg="#e0f7fa">
            <Heading as="h1" textAlign="center" color="#00796b" mb={5}>
                Top 10 Agriculture News
            </Heading>
            <VStack spacing={5}>
                {articles.map((article, index) => (
                    <Box
                        key={index}
                        bg="white"
                        borderRadius="md"
                        boxShadow="lg"
                        p={5}
                        width="100%"
                        maxWidth="300px"
                        textAlign="center"
                        transition="0.3s"
                        _hover={{ boxShadow: 'xl', transform: 'translateY(-5px)' }}
                    >
                        <Heading as="h2" size="md" mb={2} color="#d32f2f">
                            {article.title}
                        </Heading>
                        {article.urlToImage && (
                            <Image
                                src={article.urlToImage}
                                alt={article.title}
                                borderRadius="md"
                                mb={2}
                                maxWidth="100%"
                                height="auto"
                            />
                        )}
                        <Text mb={2} color="#555">
                            {article.description}
                        </Text>
                        <Button
                            as="a"
                            href={article.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            colorScheme="teal"
                            variant="solid"
                            _hover={{ bg: '#004d40' }}
                        >
                            Read more
                        </Button>
                    </Box>
                ))}
            </VStack>
        </Container>
    );
};

export default News;
