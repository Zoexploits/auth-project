const cookieParser = require('cookie-parser');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoose = require('mongoose');

const authRouter = require('./routers/authRouter');
// const userRouter = require('./routers/userRouter');
// const postRouter = require('./routers/postRouter');

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
    console.log('MongoDB connected');
    }).catch(err => {
        console.error('MongoDB connection error:', err);
    });


app.use('/api/auth', authRouter);

app.get('/', (req, res) => {
  res.json({message: 'Hello FROM THE SERVER!'});
});

app.listen(process.env.PORT, ()=> {
    console.log(`Server is running on port ${process.env.PORT}`);
});