const express = require('express')
const app = express();
const db = require('./db');
require('dotenv').config();
const cors = require('cors');

const userRoutes = require('./routes/userRoutes');
const candidateRoutes = require('./routes/candidateRoutes');
const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));



const bodyParser = require('body-parser');
app.use(bodyParser.json()); // req.body
app.use(cors());
const PORT = process.env.PORT || 3000;

// Import the router files

// Use the routers
app.use('/user', userRoutes);
app.use('/candidate', candidateRoutes);


app.listen(PORT, ()=>{
    console.log('listening on port 3000');
})