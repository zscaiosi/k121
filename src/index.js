const app = require('./configs/server')();

app.listen('3003', (log) => {
    console.log('Listening to 3000... ', process.env.NODE_ENV);
});