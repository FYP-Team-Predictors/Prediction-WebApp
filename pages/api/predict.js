export default async function handler(req, res) {

    if (req.method === 'POST') {
        //console.log('Request:', req.method, req.body);

        const { currency, timestamp } = req.body;

        console.log(currency+timestamp);

        //dummy response
        const dummyResponse = await fetch('/BTCUSDT_dummy.json');
        const data = await dummyResponse.json();
        const next_price = '425';
        const next_bottom_prob = '23.35';

        // Return the response to the frontend
        res.status(200).json({data, next_price, next_bottom_prob});

    } else {
        res.status(405).end(); // Method Not Allowed
    }
}
