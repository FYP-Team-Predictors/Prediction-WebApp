import React, { useState , useEffect} from 'react'
import Papa from 'papaparse';
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

export default function Dashboard() {
    const [display, changeDisplay] = useState('hide')
    const [value, changeValue] = useState(1)
    const [tableData, setTableData] = useState([]);
    const [lastDate, setLastDate] = useState("");

    useEffect(() => {
        async function fetchData() {
            const response = await fetch('/BTCUSDT_dummy.csv');
            const text = await response.text();
            const result = Papa.parse(text, { header: true });
            const table_data=result.data;
            setTableData(table_data);
            setLastDate(table_data[table_data.length - 2].Open_time);
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
                <ChartComponent next_timestamp={lastDate} />
                <Flex justifyContent="space-between" mt={3}>
                    <Flex align="flex-end">
                        <Heading as="h2" size="md" letterSpacing="tight">Transactions</Heading>
                        <Text fontSize="small" color="gray" ml={4}>Until {lastDate}</Text>
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

                                {display == 'show' &&
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