
// module.exports = db;

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const config = require('./config/config_db.json');
const userFunc = require('./routes/main_user');
const bodyParser = require('body-parser');

const app = express();

const host = process.env.HOST || config.host;
const port = process.env.PORT || config.port;

app.use(bodyParser.json());
app.use(cors({
    origin: '*'
}));

mongoose.connect(config.mongoURI, {
    // useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));



app.use('/', userFunc);



app.listen(config.port, config.host, () => {
    console.log(`Server started on host ${host} and port ${port}`);
});