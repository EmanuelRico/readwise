const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb+srv://rico:bolillo123@cluster0.gr86zsc.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error(err));

const reviewRoutes = require('./routes/review.routes');
app.use('/api/reviews', reviewRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});