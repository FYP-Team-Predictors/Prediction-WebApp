import { useState } from 'react';
import {
    Box,
    Button,
    Container,
    FormControl,
    FormLabel,
    Heading,
    Input,
    Link,
    Spacer,
    Text,
} from '@chakra-ui/react';
import { DTP } from '@/components/datetime-picker';

export default function SearchHomeView() {
    const [currency, setCurrency] = useState('');
    const [fromDate, setFromDate] = useState(new Date());
    const [toDate, setToDate] = useState(new Date());

    const handleCurrencyChange = (event) => {
        setCurrency(event.target.value);
    };

    return (
        <Box
            bgImage="url('/home-bg.jpg')"
            height="100vh"
            bgRepeat="no-repeat"
            bgSize="cover"
        >
            <Container
                display="flex"
                alignItems="center"
                justify="center"
                minHeight="100vh"
            >
                <Box
                    borderWidth="1px"
                    borderRadius="lg"
                    p="60px"
                    minHeight="550px"
                    display="flex"
                    flexDirection="column"
                    justifyContent="space-between"
                    bgSize="cover"
                    bgColor="gray.200"
                    opacity={0.9}
                    maxW="200%"
                    w="150%"
                >
                    <Box>
                        <Heading as="h1" size="xl" mb={5}>
                            Market Movement Predictor
                        </Heading>
                        <FormControl id="currency" mb={3}>
                            <FormLabel fontSize="xl" fontWeight="bold">
                                Enter Currency
                            </FormLabel>
                            <Input
                                placeholder="E.g. BTC, ETH, SOL"
                                value={currency}
                                onChange={handleCurrencyChange}
                                placeholderTextColor="gray.600"
                            />
                        </FormControl>
                        <Box mb={4} display="flex" flexDirection="row" alignItems="space-between">
                            <FormLabel fontSize="lg" fontWeight="bold" mr={6}>
                                Required Prediction Timestamp
                            </FormLabel>
                            <DTP/>
                        </Box>
                        <Link href="#" fontSize="lg" mb={4} color="grey">
                            <u>How to select a currency?</u>
                        </Link>
                    </Box>
                    <Button
                        mt={8}
                        color="white"
                        bg="gray.800"
                        p={8}
                        borderRadius={15}
                        fontSize={20}
                        alignSelf="center"
                        width="70%"
                    >
                        Predict
                    </Button>
                </Box>
            </Container>
        </Box>
    );
}
