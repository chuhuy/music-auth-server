const express = require('express');
const cors = require('cors');
const hpp = require('hpp');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const dotenv = require('dotenv').config();
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

// Import routes
const adminRoute = require('./src/routes/admin.route');
const userRoute = require('./src/routes/user.route');

// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
 
// Parse application/json
app.use(bodyParser.json());

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
    res.send("Music Life Auth Server");
});

// Use routes
app.use(`/api/v${process.env.API_VERSION}/admin`, adminRoute);
app.use(`/api/v${process.env.API_VERSION}/user`, userRoute);

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});