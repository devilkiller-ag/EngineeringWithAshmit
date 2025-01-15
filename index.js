const path = require('path');
const express = require('express');
const dotenv = require('dotenv');

const connectToMongoDB = require('./connection');

const userRoute = require('./routes/user');


dotenv.config();
const app = express();
const PORT = 8000;


connectToMongoDB(process.env.MONGODB_CONNECTION_URL);


app.set('view engine', 'ejs');
app.set('views', path.resolve('./views'));


app.use(express.urlencoded({ extended: false }));


app.get('/', (req, res) => {
    return res.render('home');
});


app.use('/user', userRoute);


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT} at http://localhost:${PORT}`);
});
