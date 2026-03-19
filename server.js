const express = require('express');
const cors = require('cors');
const helmet = require('helmet')
require('dotenv').config();
require('./config/passport');

const authRoutes = require('./routes/authRoutes');
const noteRoutes = require('./routes/noteRoutes')
const passport = require('passport');


const app = express();



app.use(helmet());
app.use(cors({
    origin: process.env.FRONTEND || 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());
app.use(passport.initialize());

app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`)
})