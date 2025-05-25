require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./config/db');

const app = express();
const port = process.env.port || 3000;

app.use(cors({ origin: '*'}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const userRoute = require('./routers/userRouter');
const newsRoute = require('./routers/newsRouter');

app.use('/users', userRoute);
app.use('/news', newsRoute);

const startServer = async () => {
  try {
    await db();
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();





module.exports = app;