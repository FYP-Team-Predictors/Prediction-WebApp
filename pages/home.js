import { useState } from 'react';
import * as React from 'react';
import {
    Box,
    Button,
    Container,
    FormControl,
    FormLabel,
    Heading,
    Select,
    Spinner,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import DateFnsUtils from "@date-io/date-fns";
import {KeyboardDateTimePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import {CRYPTO_END, CRYPTO_START, CURRENCY_OPTIONS, STOCK_END, STOCK_START} from "@/constants";

export default function SearchHomeView() {
    const router = useRouter();
    const [currency, setCurrency] = useState('');
    const [selectedDate, setSelectedDate] = useState(new Date(2020, 11, 1, 1, 0));
    const [isLoading, setIsLoading] = useState(false);

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    const handleCurrencyChange = (event) => {
        setCurrency(event.target.value);
    };

    const handlePredictClick = async () => {
        setIsLoading(true);

        // Format the date and time as a string
        const date = new Date(selectedDate);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const timeStep = `${year}-${month}-${day} ${hours}:${minutes}:00`;


        //console.log(currency, formattedDateTime);

        const response = await fetch('/api/predict', {
            method: 'POST',
            body: JSON.stringify({ currency: currency, timestamp: timeStep }),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            const data = await response.json();

            console.log(data);

            const jsonData=JSON.stringify(data["data"]);
            const nextPrice=data["next_price"];
            const nextBottomProb=data["next_bottom_prob"];

            //console.log(jsonData);

            // Navigate to another screen passing the necessary data as query parameters
            await router.push({
                pathname: '/dashboard',
                query: { currency, timeStep, jsonData, nextPrice, nextBottomProb },
            });
        } else {
            // Handle the error case
            console.error('Error with the predictions');
        }

        setIsLoading(false);
    };

    const getMinDate = () => {
        if (currency === 'BTC' || currency === 'LTC' || currency === 'ETH') {
            return CRYPTO_START;
        } else if (currency === 'AAPL' || currency === 'TSLA' || currency === 'SBUX') {
            return STOCK_START;
        }
    };

    const getMaxDate = () => {
        if (currency === 'BTC' || currency === 'LTC' || currency === 'ETH') {
            return CRYPTO_END;
        } else if (currency === 'AAPL' || currency === 'TSLA' || currency === 'SBUX') {
            return STOCK_END;
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
                                {CURRENCY_OPTIONS.map((option) => (
                                    <option key={option.value} value={option.value}>{option.label}</option>
                                ))}
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
                                    minDate={getMinDate()}
                                    maxDate={getMaxDate()}
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
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <Spinner color="white" size="sm" mr={2} />
                        ) : null}
                        Predict
                    </Button>

                </Box>
            </Container>
        </Box>
    );
}