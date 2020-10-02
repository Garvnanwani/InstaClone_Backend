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
const PORT = process.env.PORT || 3000;

if (process.argv.slice(2) == 'development') {
    const morgan = require('morgan');  //middleware for logging
    app.use(morgan('dev'));
    require('dotenv').config();
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

app.use("/api/auth", auth);
app.use("/api/post", post);
app.use("/api/user", user);

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server started on PORT ${PORT}`);
})

