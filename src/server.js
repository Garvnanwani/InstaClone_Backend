const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const connectDB = require('./config/db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV === 'development') {
    const morgan = require('morgan');  //middleware for logging
    app.use(morgan('dev'));
}


app.use(helmet());
app.use(helmet.hidePoweredBy());
app.use(cors());
app.use(express.json());
app.set('trust proxy', 1);

if (process.env.NODE_ENV === 'production') {
    app.use(compression());
}

connectDB()

app.use((err, req, res, next) => {

    console.log(err.message);

    if (!err.statusCode) {
        err.statusCode = 500;
    }

    if (err.name === 'MulterError') {
        if (err.message === 'File too large') {
            return res
                .status(400)
                .send({ error: 'Your file exceeds the limit of 10MB.' });
        }
    }
    res.status(err.statusCode).send({
        error: err.statusCode >= 500 ? 'An unexpected error occurred, please try again later.' : err.message,
    })



})

app.listen(PORT, () => {
    console.log(`Server started on PORT ${PORT}`);
})

