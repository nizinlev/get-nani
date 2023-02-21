const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const User = require('../models/user');
const Person = require('../models/person')
const Nani = require('../models/nani')
const Parent = require('../models/parent')

router.use(bodyParser.json());

router.post('/login', (req, res) => {
  username = req.body.username;
  pass = req.body.password;
  let current_person, current_role;

  User.findOne({ username: username, password: pass }, async function (err, result) {
    if (result) {
      // Save last enter of user
      result.last_entry = new Date();
      result.save();
      // return role + person 
      current_person = await Person.findOne({ id: result.id }).exec()
      if (result.role == 'nani') {
        current_role = await Nani.findOne({ id: result.id }).exec()
      }
      else if (result.role == 'parent') {
        current_role = await Parent.findOne({ id: result.id }).exec()
      }
      res.json({ person: current_person, user: result, role: current_role });
    }
    else {
      res.send(false)
    }
  })

})

router.post('/add_user', async (req, res) => {
  let role = req.body.userDet.role
  const newUser = new User({
    id: req.body.userDet.id,
    username: req.body.userDet.username,
    password: req.body.userDet.password,
    phone_num: req.body.userDet.phoneNumber,
    email: req.body.userDet.email,
    role: role
  })
  const newPerson = new Person({
    id: req.body.personDet.id,
    name: req.body.personDet.firstName,
    last_name: req.body.personDet.lastName,
    gender: req.body.personDet.gender

  })

  const newNani = role !== 'parent' ? new Nani({
    id: req.body.roleDet.id,
    age: req.body.roleDet.age,
    residence: req.body.roleDet.residence,
    experience_years: req.body.roleDet.experienceYears,
    about: req.body.roleDet.about
  }) : null


  const newParent = role === 'parent' ? new Parent({
    id: req.body.roleDet.id,
    child_age: req.body.roleDet.childAge,
    residence: req.body.roleDet.childResidence,
    child_gender: req.body.roleDet.childGender,
    child_name: req.body.roleDet.childName

  }) : null

  try {
    await Promise.all([newUser.save(), newPerson.save(), newNani && newNani.save(), newParent && newParent.save()]);
    console.log('saved successfully');
    res.send({ success: true });
  } catch (error) {
    console.log('save failed');
    res.status(500).send(error);
    res.send(false)
  }
})

router.get('/all_nanis', (req, res)=>{
  let allNanis = Nani.find();
  return allNanis
})

router.get('/all_all_parents', (req, res)=>{
  let allParents = Parent.find();
  return allParens
})

module.exports = router;