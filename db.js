require('dotenv').config();
const mongoose = require('mongoose');

const mongoURL = process.env.MONGODB_URL_LOCAL;

mongoose.connect(mongoURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;

db.on('connected', () => {
  console.log('Connected to MongoDB');
});

db.on('error', (err) => {
  console.log('MongoDB connection error:', err);
});

module.exports = db;
