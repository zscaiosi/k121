const app = require('./configs/server')();

app.listen('3003', (log) => {
    console.log('Listening to 3003... ', process.env.NODE_ENV);
});