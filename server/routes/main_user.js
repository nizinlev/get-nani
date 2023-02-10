const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const User = require('../models/user');

router.use(bodyParser.json());

router.get('/login', (res)=>{
})


router.post('/login', (req, res) => {
  const user = new User({
    id: req.body.id,
    username: req.body.username,
    password: req.body.password,
    phone_num: req.body.phone_num,
    email: req.body.email
  });

  user.save((err) => {
    if (err) {
      res.status(500).send(err);
    } else {
      console.log('User created successfully')
      res.send('User created successfully');
    }
  });
});

module.exports = router;