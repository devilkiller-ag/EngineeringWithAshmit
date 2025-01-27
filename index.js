const path = require('path');
const dotenv = require('dotenv');
const express = require('express');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');

const Blog = require("./models/blog");
const connectToMongoDB = require('./connection');
const { checkForAuthenticationCookie } = require('./middlewares/authentication');

const userRoute = require('./routes/user');
const blogRoute = require('./routes/blog');


dotenv.config();
const app = express();
const PORT = process.env.PORT || 8001;


connectToMongoDB(process.env.MONGODB_CONNECTION_URL);


app.set('view engine', 'ejs');
app.set('views', path.resolve('./views'));

app.use(methodOverride('_method'));
app.use(cookieParser());
app.use(checkForAuthenticationCookie('token'));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.resolve('./public')));


app.get('/', async (req, res) => {
  const allBlogs = await Blog.find({}).sort({ createdAt: -1 });

  return res.render('home', {
    user: req.user,
    blogs: allBlogs,
  });
});


app.use('/user', userRoute);
app.use('/blog', blogRoute);


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} at http://localhost:${PORT}`);
});
