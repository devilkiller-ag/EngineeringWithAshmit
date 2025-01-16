const mongoose = require('mongoose');


const connectToMongoDB = async (url) => {
    return mongoose
        .connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            connectTimeoutMS: 30000, // 30 seconds
            socketTimeoutMS: 45000, // 45 seconds
        })
        .then(() => console.log('Connected to MongoDB'))
        .catch((err) => console.log('MongoDB error: ', err));
};


module.exports = connectToMongoDB;
