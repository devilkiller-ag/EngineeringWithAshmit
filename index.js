const path = require('path');
const dotenv = require('dotenv');
const express = require('express');
const cookieParser = require('cookie-parser');

const connectToMongoDB = require('./connection');
const { checkForAuthenticationCookie } = require('./middlewares/authentication');

const userRoute = require('./routes/user');


dotenv.config();
const app = express();
const PORT = 8000;


connectToMongoDB(process.env.MONGODB_CONNECTION_URL);


app.set('view engine', 'ejs');
app.set('views', path.resolve('./views'));


app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(checkForAuthenticationCookie('token'));

app.get('/', (req, res) => {
    return res.render('home', {
        user: req.user,
    });
});


app.use('/user', userRoute);


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT} at http://localhost:${PORT}`);
});
