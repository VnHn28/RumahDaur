require('dotenv').config(); 

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const multer = require('multer');


// Express app
const app = express();
const PORT = process.env.PORT || 3000;


// Connect to MongoDB
const dbURI = process.env.MONGODB_URI;
mongoose.connect(dbURI)
.then((result) => {
  console.log('Connected to MongoDB');
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
})
.catch(err => console.error(err));


// Session configuration
app.use(session({
  secret: process.env.SECRET_KEY,
  resave: false,
  saveUninitialized: true
}));


// File upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/upload');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });


// Middleware, Set up view engine and static files
app.use(express.urlencoded({ extended: true }));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));


// Models
const Admin = require('./models/admin');
const News = require('./models/news');


// Routes
app.get('/', (req, res) => {
  res.render('index');
});

app.get('/news', (req, res) => {
  const id = req.params.news_id;
  res.render('newslist');
});

app.get('/news/:news_id', (req, res) => {
  const id = req.params.news_id;
  res.render('news', { newsId: id });
});

app.get('/admin', (req, res) => {
  if (!req.session.adminId) {
    return res.redirect('/admin/login');
  }
  res.render('admin/admin_index');
});

app.get('/admin/login', (req, res) => {
  res.render('admin/admin_login');
});

app.post('/admin/login', async (req, res) => {
  const { username, password } = req.body;
  const admin = await Admin.findOne({ username });
  if (admin && bcrypt.compareSync(password, admin.password)) {
    req.session.adminId = admin._id;
    res.redirect('/admin');
  } else {
    res.redirect('/admin/login');
  }
});

app.post('/admin/news', upload.single('img'), async (req, res) => {
  const { title, snippet, body } = req.body;
  const img = req.file ? '/upload/' + req.file.filename : '';
  const news = new News({ title, snippet, body, img });
  await news.save();
  res.redirect('/admin');
});


// 404 page
app.use((req, res) => {
  res.status(404).render('404');
});