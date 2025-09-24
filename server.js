const express = require('express');
require("dotenv").config();

const Tasks = require('./routes/Tasks');
const Auth = require('./routes/auth');
const app = express();
const mongoose = require('mongoose');

//DB config
const db= require('./middleware/keys').MongoURI;

//connect to mongoose
mongoose.connect(db)
    .then(() => console.log('mongoDb Connected'))
    .catch(err => console.log(err))

// BODY PARSER
app.use(express.json());
app.use(express.urlencoded({extended: false}))

app.use(express.json());
app.use('/api/tasks', Tasks);
app.use('/api/auth', Auth);


app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

