const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const connectDB = require('./utils/db');
const errorHandler = require('./middlewares/errorHandler');
const auth = require('./routes/auth');
const post = require('./routes/post');
const user = require('./routes/user');

const app = express();
const PORT = process.env.PORT || 5000;

if (process.argv.slice(2) == 'development') {
    const morgan = require('morgan');  //middleware for logging
    app.use(morgan('dev'));
    require('dotenv').config();
}


app.use(helmet());
app.use(helmet.hidePoweredBy());

app.use(function (req, res, next) {
res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000, https://instagraam.netlify.app/login');
res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
res.setHeader('Access-Control-Allow-Credentials', true);
next();
});

app.use(express.json());
app.set('trust proxy', 1);

if (process.env.NODE_ENV === 'production') {
    app.use(compression());
}

connectDB()

app.use("/api/auth", auth);
app.use("/api/post", post);
app.use("/api/user", user);

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server started on PORT ${PORT}`);
})

