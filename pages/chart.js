import React from 'react';
import { Line } from 'react-chartjs-2';
import Papa from 'papaparse';
import Chart from 'chart.js/auto';
import { CategoryScale, LinearScale, LineController, PointElement, LineElement } from 'chart.js';
import {Flex, Heading, IconButton, Text} from "@chakra-ui/react";

Chart.register(CategoryScale, LinearScale, LineController, PointElement, LineElement);

function ChartComponent() {
    const [chartData, setChartData] = React.useState(null);

    React.useEffect(() => {
        async function getData() {
            const response = await fetch('/BTCUSDT_dummy.csv');
            const reader = response.body.getReader();
            const result = await reader.read(); // raw array
            const decoder = new TextDecoder('utf-8');
            const csv = decoder.decode(result.value); // the csv text
            const results = Papa.parse(csv, { header: true }); // object with { data, errors, meta }
            const data = {
                labels: results.data.map(row => row.Open_time),
                datasets: [
                    {
                        label: 'Close Price',
                        data: results.data.map(row => row.Close_value),
                        fill: false,
                        borderColor: '#00BFFF', // Use a blue color for the line
                        pointBackgroundColor: '#00BFFF', // Use the same blue color for the points
                        pointBorderColor: '#fff', // Use white color for the point border
                        pointHoverBackgroundColor: '#fff', // Use white color for the point hover background
                        pointHoverBorderColor: '#00BFFF', // Use the same blue color for the point hover border
                        lineTension: 0.2, // Adjust the line tension for a smoother curve
                        backgroundColor: '#db86b2',
                        borderCapStyle: 'butt',
                        borderDashOffset: 0.0,
                        borderJoinStyle: '#B57295',
                        pointBorderWidth: 1,
                        pointHoverRadius: 5,
                        pointHoverBorderWidth: 2,
                        pointRadius: 1,
                        pointHitRadius: 10,
                    },
                ],
            };
            setChartData(data);
        }

        getData();
    }, []);

    if (!chartData) {
        return <div>Loading...</div>;
    }
    const options = {
        maintainAspectRatio: true,
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
                display: false
            }
        }
    }


    return (

        <div>
            <Flex justifyContent="left" mt={8}>
                <Flex align="flex-start">
                    <Heading as="h2" size="lg" letterSpacing="tight">BTC Price Prediction</Heading>
                </Flex>
            </Flex>

            <Flex className="chart-container">
                <Line data={chartData}  options={options}/>
                <div className="chart-legend">
                    <div className="chart-legend-item chart-legend-item-1">
                        <span className="chart-legend-item-label">Actual Price</span>
                    </div>
                    <div className="chart-legend-item chart-legend-item-2">
                        <span className="chart-legend-item-label">Predicted Price</span>
                    </div>
                </div>
            </Flex>
            <Flex className="empty-vertical" />

            <Flex className="info-container" direction="column" align="flex-start">
                <Heading as="h4" size="lg" letterSpacing="tight">Next timestep prediction</Heading>
                <p style={{ fontSize: "1.2rem" }}>
                    <br />
                    Predicted Price for the next timestep: $ 13775.45
                    <br />
                    Probability of being a bottom: 2.345%
                    <br />
                </p>

            </Flex>

        </div>
    );
}

export default ChartComponent;

