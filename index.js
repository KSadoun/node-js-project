const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const userRouter = require('./routers/users');
const postRouter = require('./routers/posts');
const commentRouter = require('./routers/comments');
const likeRouter = require('./routers/likes');
const notificationRouter = require('./routers/notifications');

const errorHandler = require('./middlewares/errorHandler');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routers
app.use('/users', userRouter);
app.use('/posts', postRouter);
app.use('/comments', commentRouter);
app.use('/likes', likeRouter);
app.use('/notifications', notificationRouter);

// last becuase it catches the errors from any previous middleware
app.use(errorHandler);

const PORT = Number(process.env.PORT);

app.listen(PORT, () => {
    mongoose.connect(`${process.env.MONGO_URL}/${process.env.DB_NAME}`)
        .then(() => {
            console.log('✓ Connected to MongoDB');
        })
        .catch((err) => {
            console.log('✗ Failed to connect to MongoDB');
            console.log(err);
        });
    console.log(`✓ Server is running on Port: ${PORT}`);
});