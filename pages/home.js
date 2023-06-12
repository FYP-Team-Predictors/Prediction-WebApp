import { useState } from 'react';
import * as React from 'react';
import {
    Box,
    Button,
    Container,
    FormControl,
    FormLabel,
    Heading,
    Input,
    Select,
    Spacer,
    Text,
} from '@chakra-ui/react';
import {DTP} from '@/components/datetime-picker';
import { useRouter } from 'next/router';
import DateFnsUtils from "@date-io/date-fns";
import {KeyboardDateTimePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";

export default function SearchHomeView() {
    const router = useRouter();
    const [currency, setCurrency] = useState('');
    const [selectedDate, setSelectedDate] = useState(new Date());

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    const handleCurrencyChange = (event) => {
        setCurrency(event.target.value);
    };

    const handlePredictClick = async () => {

        // Format the date and time as a string
        const date = new Date(selectedDate);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:00`;

        const response = await fetch('/api/predict', {
            method: 'POST',
            body: JSON.stringify({ currency, timestamp: formattedDateTime }),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            const data = await response.json();

            const { jsonData, nextPrice, nextBottomProb } = data;

            // Navigate to another screen passing the necessary data as query parameters
            await router.push({
                pathname: '/dashboard',
                query: { currency, formattedDateTime, jsonData, nextPrice, nextBottomProb },
            });
        } else {
            // Handle the error case
            console.error('Error with the predictions');
        }
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
                    minHeight="500px"
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
                            <Select
                                value={currency}
                                onChange={handleCurrencyChange}
                                width="200px"
                            >
                                <option value="">Select a currency</option>
                                <option value="BTC">BTC</option>
                                <option value="ETH">ETH</option>
                                <option value="LTC">LTC</option>
                                <option value="AAPL">AAPL</option>
                                <option value="TSLA">TSLA</option>
                                <option value="SBUX">SBUX</option>
                            </Select>
                        </FormControl>
                        <Box mb={4} display="flex" flexDirection="row" alignItems="space-between">
                            <FormLabel fontSize="lg" fontWeight="bold" mr={6}>
                                Required Prediction Timestamp
                            </FormLabel>
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                <KeyboardDateTimePicker
                                    disableToolbar
                                    variant="inline"
                                    format="MM/dd/yyyy HH:mm"
                                    margin="normal"
                                    id="datetime-picker-inline"
                                    //label="Date and Time picker inline"
                                    value={selectedDate}
                                    onChange={handleDateChange}
                                    KeyboardButtonProps={{
                                        'aria-label': 'Change date and time',
                                    }}
                                    minutesStep={5}
                                    style={{ width: '280px' }}
                                    ampm={false}
                                    views={['date', 'hours', 'minutes']}
                                />
                            </MuiPickersUtilsProvider>
                        </Box>
                    </Box>
                    <Button
                        mt={2}
                        color="white"
                        bg="gray.900"
                        p={8}
                        borderRadius={15}
                        fontSize={20}
                        alignSelf="center"
                        width="70%"
                        _hover={{ bg: 'gray.700' }}
                        onClick={handlePredictClick}
                    >
                        Predict
                    </Button>

                </Box>
            </Container>
        </Box>
    );
}