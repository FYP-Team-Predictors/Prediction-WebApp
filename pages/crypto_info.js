import React, { useState, useEffect } from 'react'
import {Flex, Box, Table, Thead, Tbody, Tr, Th, Td, useColorModeValue, Center, Spinner, Heading} from '@chakra-ui/react'
import Sidebar from "@/components/side-nav-bar";
import TableComponent from "@/components/table-data";

export default function Crypto_info() {

    const [data, setData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/currencyData.json');
                const currencyData = await response.json();
                setData(currencyData);
            } catch (error) {
                console.error('Error fetching data:', error);
                setData(null);
            }
        };

        fetchData();
    }, []);

    return (

        <Flex
            h={[null, null, "100vh"]}
            maxW="2000px"
            flexDir={["column", "column", "row"]}
            overflow="hidden"
        >
            {/* Column 1 */}
            <Sidebar activePage="crypto_info" />

            {/* Column 2 */}

            <Flex
                w={["100%", "100%", "100%", "100%", "100%"]}
                p="3%"
                flexDir="column"
                overflow="auto"
                minH="100vh"
            >
                <Heading
                    fontWeight="normal"
                    mb={-70}
                    letterSpacing="tight"
                >
                    Predicting, <Flex display="inline-flex" fontWeight="bold">Crypto & Stocks</Flex>
                </Heading>
                <Flex h="100vh" align="center">
                    {!data ? (
                        <Center h="100vh">
                            <Spinner size="xl" color="blue.500" animation="spin" />
                        </Center>
                    ) : (
                        <TableComponent data={data} />
                    )}
                </Flex>
            </Flex>
        </Flex>
    );
}