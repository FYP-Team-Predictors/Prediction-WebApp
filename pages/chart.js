import React from 'react';
import { Line } from 'react-chartjs-2';
import Papa from 'papaparse';
import Chart from 'chart.js/auto';
import { CategoryScale, LinearScale, LineController, PointElement, LineElement } from 'chart.js';
import {Center, Flex, Heading, IconButton, Spinner, Text} from "@chakra-ui/react";
import PredictionCard from "@/components/prediction-card";

Chart.register(CategoryScale, LinearScale, LineController, PointElement, LineElement);

function ChartComponent({next_timestamp}) {
    const [chartData, setChartData] = React.useState(null);

    React.useEffect(() => {
        async function getData() {
            const response1 = await fetch('/BTCUSDT_dummy.csv');
            const reader1 = response1.body.getReader();
            const result1 = await reader1.read(); // raw array
            const decoder1 = new TextDecoder('utf-8');
            const csv1 = decoder1.decode(result1.value); // the csv text
            const results1 = Papa.parse(csv1, { header: true }); // object with { data, errors, meta }

            const response2 = await fetch('/BTCUSDT_dummy_pred.csv');
            const reader2 = response2.body.getReader();
            const result2 = await reader2.read(); // raw array
            const decoder2 = new TextDecoder('utf-8');
            const csv2 = decoder2.decode(result2.value); // the csv text
            const results2 = Papa.parse(csv2, { header: true }); // object with { data, errors, meta }


            const data = {
                labels: results2.data.map(row => row.Open_time),
                datasets: [
                    {
                        label: 'Close Price',
                        data: results1.data.map(row => row.Close_value),
                        fill: false,
                        borderColor: '#00BFFF', // Use a blue color for the line
                        pointBackgroundColor: '#00BFFF', // Use the same blue color for the points
                        pointBorderColor: '#fff', // Use white color for the point border
                        pointHoverBackgroundColor: '#fff', // Use white color for the point hover background
                        pointHoverBorderColor: '#00BFFF', // Use the same blue color for the point hover border
                        lineTension: 0.2, // Adjust the line tension for a smoother curve
                        // backgroundColor: '#db86b2',
                        borderCapStyle: 'butt',
                        borderDashOffset: 0.0,
                        borderJoinStyle: '#B57295',
                        pointBorderWidth: 1,
                        pointHoverRadius: 5,
                        pointHoverBorderWidth: 2,
                        pointRadius: 1,
                        pointHitRadius: 10,
                    },
                    {
                        label: 'Predicted Price',
                        data: results2.data.map(row => row.Predict_value),
                        fill: false,
                        borderColor: '#FF4136', // Use a red color for the line
                        pointBackgroundColor: '#FF4136', // Use the same red color for the points
                        pointBorderColor: '#fff', // Use white color for the point border
                        pointHoverBackgroundColor: '#fff', // Use white color for the point hover background
                        pointHoverBorderColor: '#FF4136', // Use the same red color for the point hover border
                        lineTension: 0.2, // Adjust the line tension for a smoother curve
                        //backgroundColor: '#FFC2C1',
                        borderCapStyle: 'butt',
                        borderDashOffset: 0.0,
                        borderJoinStyle: '#FDB8B6',
                        pointBorderWidth: 1,
                        pointHoverRadius: 5,
                        pointHoverBorderWidth: 2,
                        pointRadius: 1,
                        pointHitRadius: 10,
                    }
                ],
            };
            setChartData(data);
        }

        getData();
    }, []);

    if (!chartData) {
        return <Center h="100vh">
            <Spinner size="xl" color="blue.500" animation="spin" />
        </Center>;
    }

    const options = {
        maintainAspectRatio: false,
        responsive: true,
        scales: {
            x: {
                grid: {
                    display: false,
                },
                ticks: {
                    color: 'dark_grey',
                    font: {
                        size: 13
                    }
                }
            },
            y: {
                grid: {
                    borderDash: [3, 3],
                },
                ticks: {
                    color: 'dark_grey',
                    font: {
                        size: 12
                    }
                }
            },
        },
        plugins: {
            legend: {
                display: true,
                position: 'top',
                labels: {
                    color: 'black',
                    font: {
                        size: 12,
                        family: 'Arial',
                        weight: 'bold',
                    },
                    padding: 20,
                },
            },
        },
        elements: {
            line: {
                borderWidth: 4,
                tension: 0.4,
            },
            point: {
                radius: 5,
                hitRadius: 10,
                hoverRadius: 8,
                borderWidth: 2,
            },
        },
        layout: {
            padding: {
                left: 10,
                right: 10,
                top: 0,
                bottom: 0,
            },
        },
        animation: {
            duration: 1000,
        },
    }


    return (

        <div>
            <Flex flexDirection="column" justifyContent="center">
                <Flex justifyContent="left" mt={8}>
                    <Flex align="flex-start">
                        <Heading as="h2" size="md" letterSpacing="tight">BTC Price Prediction</Heading>
                    </Flex>
                </Flex>
                <Flex className="empty-vertical"/>
                <Flex justifyContent="space-between">
                    <Flex className="chart-container" style={{ alignItems: 'center' }}>
                        <Line data={chartData} options={options} />
                    </Flex>

                    <Flex className="empty-horizontal"/>

                    <Flex className="info-container" direction="column" align="center" justifyContent="center">
                        <Heading as="h3" size="md" letterSpacing="tight">Next timestep prediction</Heading>
                        <Text fontWeight="bold" fontSize="sm">{next_timestamp}</Text>
                        <Flex className="empty-vertical"/>

                        <Flex p={4} bg="gray.50" borderRadius="lg" align="center" justifyContent="center">
                            <PredictionCard title="Predicted Price" value="$ 13775.45" />
                            <PredictionCard title="Probability of Bottom" value="2.345%" />
                        </Flex>
                    </Flex>
                </Flex>
            </Flex>

        </div>
    );
}

export default ChartComponent;

