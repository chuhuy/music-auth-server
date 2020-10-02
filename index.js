const express = require('express');
const cors = require('cors');
const hpp = require('hpp');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const dotenv = require('dotenv').config();
const bodyParser = require('body-parser');

const app = express();
const port = 4000;

// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
 
// Parse application/json
app.use(bodyParser.json());

app.use((req, res) => {
    res.setHeader('Content-Type', 'text/plain')
    res.write('you posted:\n')
    res.end(JSON.stringify(req.body, null, 2))
});

// Allow Cross-Origin requests
app.use(cors());

// Set security HTTP requests
app.use(helmet());

// Limit request from the same IP
const limiter = rateLimit({
    max: 10,
    windowMs: 60 * 60 * 100, // 10 requests per hour
});
app.use(limiter);

// Prevent parameter pollution
app.use(hpp());

// Test
app.get('/', (req, res) => {
    const connection = require('./src/database/connect');
    connection.connect();
    connection.query('SELECT * FROM admin', (error, results, fields) => {
        if(error) console.log(error);
        else {
            console.log(results[0]);
        }
    })
    res.send("Music Life Auth Server");
});

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});