export default async function handler(req, res) {

    if (req.method === 'POST') {
        console.log('Request:', req.method, req.body);

        const { currency, timestamp } = req.body;


        console.log(currency, timestamp);

        //dummy response
        // const dummyResponse = await fetch('/BTCUSDT_dummy.json');
        // const data = await dummyResponse.json();
        // const next_price = '425';
        // const next_bottom_prob = '23.35';

        // Return the response to the frontend
        // res.status(200).json({data, next_price, next_bottom_prob});

        const { exec } = require('child_process');

        exec(`python ./predictor_source/predict.py "${currency}" "${timestamp}"`, async (error, stdout, stderr) => {
            if (error) {
                console.error(`Error executing: ${error}`);
                res.status(500).json({error: 'An error occurred while executing the script.'});
                return;
            }

            const jsonOutput = JSON.parse(stdout.trim());

            // Return the response to the frontend
            res.status(200).json(jsonOutput);
        });
    }
    //else {
    //     res.status(405).end(); // Method Not Allowed
    // }
}



