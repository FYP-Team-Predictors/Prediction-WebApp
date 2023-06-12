// export default async function handler(req, res) {
//
//     if (req.method === 'POST') {
//         console.log('Request:', req.method, req.body);
//
//         const { currency, timestamp } = req.body;
//
//         //dummy response
//         const dummyResponse = await fetch('/BTCUSDT_dummy.json');
//         const data = await dummyResponse.json();
//         const next_price = '425';
//         const next_bottom_prob = '23.35';
//
//         // Return the response to the frontend
//         res.status(200).json({data, next_price, next_bottom_prob});
//
//         // const { exec } = require('child_process');
//         //
//         // exec(`python predict.py ${currency} ${timestamp}`, async (error, stdout, stderr) => {
//         //     if (error) {
//         //         console.error(`Error executing Python script: ${error}`);
//         //         res.status(500).json({error: 'An error occurred while executing the script.'});
//         //         return;
//         //     }
//         //
//         //     //TODO: DELETE dummy response
//         //     const dummyResponse = await fetch('/BTCUSDT_dummy.json');
//         //     const dummyData = await dummyResponse.json();
//         //
//         //
//         //     // Process the output and prepare the response
//         //     const data = dummyData;
//         //     const next_price = '425';
//         //     const next_bottom_prob = '23.35';
//         //
//         //     //const [data, nextPrice, nextBottomProb] = stdout.trim().split(',');
//         //
//         //     // Return the response to the frontend
//         //     res.status(200).json({data, next_price, next_bottom_prob});
//         // });
//     } else {
//         res.status(405).end(); // Method Not Allowed
//     }
// }
