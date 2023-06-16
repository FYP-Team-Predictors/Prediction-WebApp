import React from 'react';
import { Line } from 'react-chartjs-2';
import { Center, Flex, Heading, IconButton, Spinner, Text } from "@chakra-ui/react";
import PredictionCard from "@/components/prediction-card";
import Chart from 'chart.js/auto';
import { CategoryScale, LinearScale, LineController, PointElement, LineElement } from 'chart.js';
Chart.register(CategoryScale, LinearScale, LineController, PointElement, LineElement);

function ChartComponent({ predCurrency, nextTimestamp, jsonData, nextPrice, nextBottomProb }) {
    const [chartData, setChartData] = React.useState(null);

    React.useEffect(() => {
        async function getData() {

            // Fetch data from the API or local JSON file
            // const response = await fetch('/BTCUSDT_dummy.json');
            const data = JSON.parse(jsonData);

            // Process the data to fit the chart format
            const labels = data.map(row => row.Open_time);
            const closePriceData = data.map(row => row.Close_value);
            const predictedPriceData = data.map(row => row.Predict_value);

            // Add the next timestamp and price to the chart data
            const nextTimestampIndex = labels.length;
            labels.push(nextTimestamp);
            closePriceData.push(null);
            predictedPriceData.push(parseFloat(nextPrice));

            const chartData = {
                labels: labels,
                datasets: [
                    {
                        label: 'Close Price',
                        data: closePriceData,
                        fill: false,
                        borderColor: '#00BFFF',
                        pointBackgroundColor: '#00BFFF',
                        pointBorderColor: '#fff',
                        pointHoverBackgroundColor: '#fff',
                        pointHoverBorderColor: '#00BFFF',
                        lineTension: 0.2,
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
                        data: predictedPriceData,
                        fill: false,
                        borderColor: (context) =>
                            context.dataIndex < nextTimestampIndex ? '#FFA500' : '#FF0000',
                        pointBackgroundColor: (context) =>
                            context.dataIndex === nextTimestampIndex ? '#FF0000' : '#FFA500',
                        pointBorderColor: '#fff',
                        pointHoverBackgroundColor: '#fff',
                        pointHoverBorderColor: '#FF4136',
                        lineTension: 0.2,
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
            setChartData(chartData);
        }
        getData();
    }, []);

    if (!chartData) {
        return (
            <Center h="100vh">
                <Spinner size="xl" color="blue.500" animation="spin" />
            </Center>
        );
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
                        <Heading as="h2" size="md" letterSpacing="tight">{predCurrency} Price Prediction</Heading>
                    </Flex>
                </Flex>
                <Flex className="empty-vertical" />
                <Flex justifyContent="space-between">
                    <Flex className="chart-container" style={{ alignItems: 'center' }}>
                        <Line data={chartData} options={options} />
                    </Flex>

                    <Flex className="empty-horizontal" />

                    <Flex className="info-container" direction="column" align="center" justifyContent="center">
                        <Heading as="h3" size="md" letterSpacing="tight">Next timestep prediction</Heading>
                        <Text fontWeight="bold" fontSize="sm">{nextTimestamp}</Text>
                        <Flex className="empty-vertical" />

                        <Flex p={4} bg="gray.50" borderRadius="lg" align="center" justifyContent="center">
                            <PredictionCard title="Predicted Price $" value={nextPrice} />
                            <PredictionCard title="Probability of Being Bottom" value={nextBottomProb} />
                        </Flex>
                    </Flex>
                </Flex>
            </Flex>
        </div>
    );
}

export default ChartComponent;
