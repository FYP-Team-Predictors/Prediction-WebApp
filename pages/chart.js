import React from 'react';
import { Line } from 'react-chartjs-2';
import Papa from 'papaparse';
import Chart from 'chart.js/auto';
import { CategoryScale, LinearScale, LineController, PointElement, LineElement } from 'chart.js';

Chart.register(CategoryScale, LinearScale, LineController, PointElement, LineElement);

function ChartComponent() {
    const [chartData, setChartData] = React.useState(null);

    React.useEffect(() => {
        async function getData() {
            const response = await fetch('/BTCUSDT.csv');
            const reader = response.body.getReader();
            const result = await reader.read(); // raw array
            const decoder = new TextDecoder('utf-8');
            const csv = decoder.decode(result.value); // the csv text
            const results = Papa.parse(csv, { header: true }); // object with { data, errors, meta }
            const data = {
                labels: results.data.map(row => row.date),
                datasets: [
                    {
                        label: 'Close Price',
                        data: results.data.map(row => row.close_price),
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
            },
            y: {
                grid: {
                    borderDash: [3, 3],
                },
                // beginAtZero: true, // this works
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
            <div className="chart-container">
                <h2 className="chart-title">BTC Price Prediction</h2>
                <Line data={chartData}  options={options}/>
                {/*<div className="chart-legend">*/}
                {/*    <div className="chart-legend-item chart-legend-item-1">*/}
                {/*        <span className="chart-legend-item-label">Actual Price</span>*/}
                {/*    </div>*/}
                {/*    <div className="chart-legend-item chart-legend-item-2">*/}
                {/*        <span className="chart-legend-item-label">Predicted Price</span>*/}
                {/*    </div>*/}
                {/*</div>*/}
            </div>
            <div className="empty-vertical"/>
            <div className="info-container">
                <h4 className="chart-title">Next timestep prediction</h4>
                <p>
                    Predicted Price for the next timestep:
                    <br/>
                    Probability of being a bottom:
                    <br/>
                </p>
            </div>
        </div>
    );
}

export default ChartComponent;

