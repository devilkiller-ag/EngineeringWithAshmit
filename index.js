const path = require('path');
const express = require('express');


const app = express();
const PORT = 8000;


app.set('view engine', 'ejs');
app.set('views', path.resolve('./views'));


app.get('/', (req, res) => {
    return res.render('home');
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT} at http://localhost:${PORT}`);
});
