import { useState, useEffect } from 'react'
import axios from 'axios'
import { Flex, Heading, Text, Box, SimpleGrid, useColorModeValue } from '@chakra-ui/react'
import { Line } from 'react-chartjs-2'
import Sidebar from "@/components/side-nav-bar";

export default function Dashboard() {
    const [data, setData] = useState(null)
    const coinId = 'bitcoin'

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await axios.get(`https://api.coingecko.com/api/v3/coins/${coinId}`)
                setData(result.data)
            } catch (error) {
                console.error('Error fetching data:', error)
                setData(null)
            }
        }

        fetchData()
    }, [coinId])


    const textColor = useColorModeValue('gray.700', 'white')
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                titleColor: textColor,
                bodyColor: textColor,
                borderColor: 'rgba(0, 0, 0, 0.1)',
                borderWidth: 1,
                displayColors: false,
                callbacks: {
                    label: (context) => {
                        return `$${context.parsed.y.toLocaleString()}`
                    },
                },
            },
        },
        scales: {
            x: {
                grid: {
                    display: false,
                },
                ticks: {
                    color: textColor,
                },
            },
            y: {
                grid: {
                    color: useColorModeValue('gray.200', 'gray.600'),
                },
                ticks: {
                    color: textColor,
                },
            },
        },
    }


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
                {data && data.market_data.sparkline_7d && (
                    <>
                    <Heading size="lg" mb={4} color={textColor}>
                        {data.name} ({data.symbol.toUpperCase()})
                    </Heading>
                    <Box borderWidth="1px" borderRadius="lg" p={4} mb={4}>
                        <Text fontSize="2xl" mb={2} color={textColor}>
                            Current Price: ${data.market_data.current_price.usd.toLocaleString()}
                        </Text>
                        <Text fontSize="2xl" mb={2} color={textColor}>
                            Market Cap: ${data.market_data.market_cap.usd.toLocaleString()}
                        </Text>
                        <Text fontSize="2xl" mb={2} color={textColor}>
                            Total Volume: ${data.market_data.total_volume.usd.toLocaleString()}
                        </Text>
                    </Box>
                    <Box borderWidth="1px" borderRadius="lg" p={4} mb={4}>
                        <Text fontSize="2xl" mb={2} color={textColor}>
                            Price Chart
                        </Text>
                        <Line data={data.market_data.sparkline_7d.price} options={options} />
                    </Box>
                    <Box borderWidth="1px" borderRadius="lg" p={4}>
                        <Text fontSize="2xl" mb={2} color={textColor}>
                            Market Data
                        </Text>
                        <SimpleGrid columns={[1, 2, 2, 3]} spacing={4}>
                            <Box>
                                <Text fontWeight="bold" mb={2}>
                                    Market Cap Rank
                                </Text>
                                <Text>{data.market_cap_rank}</Text>
                            </Box>
                            <Box>
                                <Text fontWeight="bold" mb={2}>
                                    Circulating Supply
                                </Text>
                                <Text>{data.market_data.circulating_supply.toLocaleString()}</Text>
                            </Box>
                            <Box>
                                <Text fontWeight="bold" mb={2}>
                                    Total Supply
                                </Text>
                                <Text>{data.market_data.total_supply ? data.market_data.total_supply.toLocaleString() : 'N/A'}</Text>
                            </Box>
                            <Box>
                                <Text fontWeight="bold" mb={2}>
                                    Max Supply
                                </Text>
                                <Text>{data.market_data.max_supply ? data.market_data.max_supply.toLocaleString() : 'N/A'}</Text>
                            </Box>
                            <Box>
                                <Text fontWeight="bold" mb={2}>
                                    ATH Price
                                </Text>
                                <Text>${data.market_data.ath.usd.toLocaleString()}</Text>
                            </Box>
                            <Box>
                                <Text fontWeight="bold" mb={2}>
                                    ATH Date
                                </Text>
                                <Text>{new Date(data.market_data.ath_date.usd).toLocaleDateString()}</Text>
                            </Box>
                            <Box>
                                <Text fontWeight="bold" mb={2}>
                                    Total Value Locked (TVL)
                                </Text>
                                <Text>{data.market_data.total_value_locked ? `$${data.market_data.total_value_locked.usd.toLocaleString()}` : 'N/A'}</Text>
                            </Box>
                        </SimpleGrid>
                    </Box>
                    </>
                )}
                {!data && (
                    <Flex
                        justify="center"
                        align="center"
                        h="100vh"
                        w="100vw"
                    >
                        <Text fontSize="3xl">Loading...</Text>
                    </Flex>
                )}
            </Flex>
        </Flex>
    )
}