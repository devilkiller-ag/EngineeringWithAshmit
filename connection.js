const mongoose = require('mongoose');


const connectToMongoDB = async (url) => {
    return mongoose
        .connect(url)
        .then(() => console.log('Connected to MongoDB'))
        .catch((err) => console.log('MongoDB error: ', err));
};


module.exports = connectToMongoDB;
