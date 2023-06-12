import React, { useState , useEffect} from 'react'
import {
    Flex,
    Heading,
    Text,
    IconButton,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Divider,
} from '@chakra-ui/react'
import {
    FiCalendar,
    FiChevronDown,
    FiChevronUp,
} from "react-icons/fi"
import ChartComponent from "@/pages/chart";
import Sidebar from "@/components/side-nav-bar";
import { useRouter } from 'next/router';

export default function Dashboard() {
    const [display, changeDisplay] = useState('hide')
    //const [predCurrency, setPredCurrency] = useState("")
    const [tableData, setTableData] = useState([]);
    //const [lastDate, setLastDate] = useState("");
    const router = useRouter();
    const { currency, selectedDate, jsonData, nextPrice, nextBottomProb } = router.query;


    useEffect(() => {
        async function fetchData() {

            // Fetch data from the API or local JSON file
            const dummyResponse = await fetch('/BTCUSDT_dummy.json');
            const dummyJsonData = await dummyResponse.json();

            const processedData = dummyJsonData.map((row) => ({
                id: row.id,
                Open_time: row.Open_time,
                Open_value: row.Open_value,
                High_value: row.High_value,
                Low_value: row.Low_value,
                Close_value: row.Close_value,
                Volume: row.Volume,
                Number_of_trades: row.Number_of_trades,
            }));

            setTableData(processedData);
            //setLastDate(processedData[processedData.length - 2].Open_time);
            //setLastDate(selectedDate);
            //setPredCurrency(currency);
        }
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
            <Sidebar activePage="dashboard" />

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
                    mb={2}
                    letterSpacing="tight"
                >
                    Market Movement Predictor, <Flex display="inline-flex" fontWeight="bold">Bottoms</Flex>
                </Heading>
                <ChartComponent predCurrency={currency} nextTimestamp={selectedDate} jsonData={jsonData} nextPrice={nextPrice} nextBottomProb={nextBottomProb}/>
                <Flex justifyContent="space-between" mt={3}>
                    <Flex align="flex-end">
                        <Heading as="h2" size="md" letterSpacing="tight">Transactions</Heading>
                        <Text fontSize="small" color="gray" ml={4}>Until {selectedDate}</Text>
                    </Flex>
                    <IconButton icon={<FiCalendar />} />
                </Flex>
                <Flex flexDir="column">
                    <Flex overflow="auto">
                        <Table variant="unstyled" mt={4}>
                            <Thead>
                                <Tr color="gray">
                                    <Th>Open Time</Th>
                                    <Th isNumeric>Open</Th>
                                    <Th isNumeric>High</Th>
                                    <Th isNumeric>Low</Th>
                                    <Th isNumeric>Close</Th>
                                    <Th isNumeric>Volume</Th>
                                    <Th isNumeric>Number of trades</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {tableData.slice(0, 5).map((row) => (
                                    <Tr key={row.id}>
                                        <Td>{row.Open_time}</Td>
                                        <Td isNumeric>{row.Open_value}</Td>
                                        <Td isNumeric>{row.High_value}</Td>
                                        <Td isNumeric>{row.Low_value}</Td>
                                        <Td isNumeric>{row.Close_value}</Td>
                                        <Td isNumeric>{row.Volume}</Td>
                                        <Td isNumeric>{row.Number_of_trades}</Td>
                                    </Tr>
                                ))}

                                {display === 'show' &&
                                    <>
                                        {tableData.map((row) => (
                                            <Tr key={row.id}>
                                                <Td>{row.Open_time}</Td>
                                                <Td isNumeric>{row.Open_value}</Td>
                                                <Td isNumeric>{row.High_value}</Td>
                                                <Td isNumeric>{row.Low_value}</Td>
                                                <Td isNumeric>{row.Close_value}</Td>
                                                <Td isNumeric>{row.Volume}</Td>
                                                <Td isNumeric>{row.Number_of_trades}</Td>
                                            </Tr>
                                        ))}

                                    </>
                                }
                            </Tbody>
                        </Table>

                    </Flex>
                    <Flex align="center">
                        <Divider />
                        <IconButton
                            icon={display === 'show' ? <FiChevronUp /> : <FiChevronDown />}
                            onClick={() => {
                                if (display === 'show') {
                                    changeDisplay('none')
                                } else {
                                    changeDisplay('show')
                                }
                            }}
                        />
                        <Divider />
                    </Flex>
                </Flex>
            </Flex>


        </Flex>
    )
}