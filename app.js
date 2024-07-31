require('dotenv').config(); 

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

//express app
const app = express();

//connect to MongoDB
const dbURI = process.env.MONGODB_URI;
mongoose.connect(dbURI)
.then((result) => {
  console.log('Connected to MongoDB');
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
})
.catch(err => console.error(err));

// Set up view engine and static files
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

//routes
app.get('/', (req, res) => {
  res.render('index');
});
  
app.get('/news/:news_id', (req, res) => {
  const id = req.params.news_id;
  res.render('news', { newsId: id });
});

const PORT = process.env.PORT || 3000;