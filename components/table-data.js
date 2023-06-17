import { Box, Table, Thead, Tbody, Tr, Th, Td, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

const TableComponent = ({ data }) => {
    const tableBgColor = useColorModeValue("gray.300", "gray.700"); // Make the table color darker
    const tableBorderColor = useColorModeValue("black", "white");
    const headerBgColor = useColorModeValue("gray.400", "gray.900"); // Darker background for header
    const roundedCorner = "lg";

    return (
        <Box overflowX="auto" p="4">
            <Table
                variant="simple"
                bg={tableBgColor}
                borderColor={tableBorderColor}
                borderCollapse="separate"
                borderSpacing="10rem" // Add space between rows and columns
                borderRadius={roundedCorner} // Add rounded corners to table
            >
                <Thead bg={headerBgColor}>
                    <Tr>
                        <Th color={useColorModeValue("gray.700", "gray.800")} py="5">Currency Name</Th>
                        <Th color={useColorModeValue("gray.700", "gray.800")} py="5">Currency Symbol</Th>
                        <Th color={useColorModeValue("gray.700", "gray.800")} py="5" px="10">Marketplace Name</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {data.map((currency) => (
                        <Tr key={currency.currencySymbol}>
                            <Td
                                color={useColorModeValue("gray.800", "white")}
                                borderRadius={roundedCorner} // Add rounded corners
                                borderTopColor={tableBorderColor}
                                borderTopWidth="1.5px"
                                px="16"
                                py="4" // Increase vertical padding
                            >
                                {currency.currencyName}
                            </Td>
                            <Td
                                color={useColorModeValue("gray.800", "white")}
                                borderRadius={roundedCorner}
                                borderTopColor={tableBorderColor}
                                borderTopWidth="1.5px"
                                px="16"
                                py="4"
                            >
                                {currency.currencySymbol}
                            </Td>
                            <Td
                                color={useColorModeValue("gray.800", "white")}
                                borderRadius={roundedCorner}
                                borderTopColor={tableBorderColor}
                                borderTopWidth="1.5px"
                                px="16"
                                py="4"
                            >
                                {currency.stockExchangeName}
                            </Td>
                        </Tr>
                    ))}
                </Tbody>
            </Table>
        </Box>
    );
};

export default TableComponent;

