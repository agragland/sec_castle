const express = require('express');
const mongoose = require('mongoose');
const cors  = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path')

require('dotenv').config();

//import routes
const castleRouter = require('./routes/castle-router')

//app
const app = express();

//connect to db
mongoose
    .connect(process.env.DATABASE, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('DB Connected'));

//middleware
app.use(bodyParser.json())
app.use(cors({
    origin: ["http://localhost:3000"],
    credentials: true,
}))
app.use(cookieParser())


app.use('/api', castleRouter);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

const port = process.env.PORT || 8000;

app.listen(port, () => {
    console.log(`Server is running on ${port}`)
});