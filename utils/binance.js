import WebSocket from 'ws';

const socket = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@kline_5m');

socket.on('open', () => {
    console.log('WebSocket connection established');
});

socket.on('message', (data) => {
    console.log(data);
});

socket.on('close', () => {
    console.log('WebSocket connection closed');
});
