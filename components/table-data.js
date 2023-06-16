import { Box, Table, Thead, Tbody, Tr, Th, Td, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

const TableComponent = ({ data }) => {
    const tableBgColor = useColorModeValue("gray.200", "gray.800");
    const tableBorderColor = useColorModeValue("black", "white");

    return (
        <Box overflowX="auto">
            <Table
                variant="simple"
                bg={tableBgColor}
                borderColor={tableBorderColor}
                borderCollapse="separate" // Add separation between cells
                borderSpacing="0 4px" // Set the spacing between cells
            >
                <Thead>
                    <Tr>
                        <Th color={useColorModeValue("gray.600", "gray.400")}>Currency Name</Th>
                        <Th color={useColorModeValue("gray.600", "gray.400")}>Currency Symbol</Th>
                        <Th color={useColorModeValue("gray.600", "gray.400")}>Stock Exchange Name</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {data.map((currency) => (
                        <Tr key={currency.currencySymbol}>
                            <Td
                                color={useColorModeValue("gray.800", "white")}
                                borderRadius="md" // Add rounded corners
                                borderTopColor={tableBorderColor} // Set the top border color
                                borderTopWidth="1.5px" // Add top border
                                px="16" // Increase horizontal padding
                            >
                                {currency.currencyName}
                            </Td>
                            <Td
                                color={useColorModeValue("gray.800", "white")}
                                borderRadius="md" // Add rounded corners
                                borderTopColor={tableBorderColor} // Set the top border color
                                borderTopWidth="1.5px" // Add top border
                                px="16" // Increase horizontal padding
                            >
                                {currency.currencySymbol}
                            </Td>
                            <Td
                                color={useColorModeValue("gray.800", "white")}
                                borderRadius="md" // Add rounded corners
                                borderTopColor={tableBorderColor} // Set the top border color
                                borderTopWidth="1.5px" // Add top border
                                px="16" // Increase horizontal padding
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
