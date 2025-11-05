// const express = require('express');
// const app = express();
// require('dotenv').config();
// const cors = require('cors');
// const bodyParser = require('body-parser');
// const path = require('path');

// // Import routes
// const userRoutes = require('./routes/userRoutes');
// const candidateRoutes = require('./routes/candidateRoutes');

// // Static files
// app.use(express.static(path.join(__dirname, 'public')));
// app.use(bodyParser.json());
// app.use(cors());

// // ✅ MongoDB connection (works for both local & Docker)
// const mongoose = require('mongoose');
// const mongoURL = process.env.MONGO_URL || process.env.MONGODB_URL_LOCAL;

// mongoose.connect(mongoURL, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// })
// .then(() => console.log('✅ Connected to MongoDB'))
// .catch((err) => console.error('❌ MongoDB connection failed:', err));

// // Routes
// app.use('/user', userRoutes);
// app.use('/candidate', candidateRoutes);

// // Start server
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//     console.log(`🚀 Server running on port ${PORT}`);
// });
// server.js

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// Import routes
const userRoutes = require('./routes/userRoutes');
const candidateRoutes = require('./routes/candidateRoutes');

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(cors());

// ✅ Determine MongoDB connection URL (works locally & in Docker)
const mongoURL =
  process.env.MONGO_URL ||          // used when running inside Docker
  process.env.MONGODB_URL_LOCAL ||  // used when running locally
  'mongodb://127.0.0.1:27017/voting'; // fallback if env vars missing

console.log(`📦 Attempting MongoDB connection to: ${mongoURL}`);

// ✅ Connect to MongoDB (no deprecated options)
mongoose
  .connect(mongoURL)
  .then(() => console.log('✅ Connected to MongoDB successfully'))
  .catch((err) => console.error('❌ MongoDB connection failed:', err.message));

// Routes
app.use('/user', userRoutes);
app.use('/candidate', candidateRoutes);

// Optional: Health check route (useful for Docker)
app.get('/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.status(200).json({
    status: 'ok',
    database: dbStatus,
    timestamp: new Date(),
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
