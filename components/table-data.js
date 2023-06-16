import { Box, Table, Thead, Tbody, Tr, Th, Td } from '@chakra-ui/react';

const TableComponent = ({ data }) => {
    return (
        <Box overflowX="auto">
            <Table variant="simple">
                <Thead>
                    <Tr>
                        <Th>Currency Name</Th>
                        <Th>Currency Symbol</Th>
                        <Th>Stock Exchange Name</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {data.map((currency) => (
                        <Tr key={currency.currencySymbol}>
                            <Td>{currency.currencyName}</Td>
                            <Td>{currency.currencySymbol}</Td>
                            <Td>{currency.stockExchangeName}</Td>
                        </Tr>
                    ))}
                </Tbody>
            </Table>
        </Box>
    );
};

export default TableComponent;
