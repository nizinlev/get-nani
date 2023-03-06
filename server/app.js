
// module.exports = db;

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const config = require('./config/config_db.json');
const userFunc = require('./routes/user');
const bodyParser = require('body-parser');

const app = express();

const HOST = process.env.HOST || config.host;
const PORT = process.env.PORT || config.port;

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


app.get('/.',(req,res)=>{
    res.send('hallo from server')
})


app.use('/user', userFunc);



app.listen(PORT, () => {
    console.log(`Server is running ${PORT}`);
});


