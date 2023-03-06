const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const User = require('../models/user');
const Person = require('../models/person')
const Nani = require('../models/nani')
const Parent = require('../models/parent')
const OfferList = require('../models/offer_list')
const { HistoryRate, historyRateSchema } = require('../models/history_rate')

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

router.get('/all_nanis', async (req, res) => {
  let allNanis = await User.find({ role: 'nani' });
  res.json(allNanis)
  return allNanis
})

router.get('/all_parents', async (req, res) => {
  let allParents = await User.find({ role: 'parent' });
  res.json(allParents)
  return allParents;
})
router.get('/all_offers/', async (req, res) => {
  const id = req.query.id; 
  const now = new Date()
  const all_offers = await OfferList.find({ id: { $nin: [id] }, time_start: { $gt: now }}).sort({time_start:1});
  const offerListWithUsers = [];
  for (const offer of all_offers) {
    const user = await User.findOne({ id: offer.id });
    offer._doc.user = user;
    offerListWithUsers.push(offer);
  }
  res.json(offerListWithUsers);
});
router.get('/all_history/', async (req, res) => {
  const id = req.query.id; 
  const all_history = await OfferList.find({ id: id }).sort({time_start:1});
  
  const historyListWithUsers = [];
  for (const item of all_history) {
    const user = await User.findOne({ id: item.id });
    item._doc.user = user;
    historyListWithUsers.push(item);
  }
  res.json(historyListWithUsers);
});


router.post('/add_offer', async (req, res) => {
  data = req.body.data
  try {
    const new_offer = new OfferList(data)
    await new_offer.save()
    res.json({ 'success': true })
  } catch (error) {
    console.log(error)
    res.json({ 'success': false })
  }
})








router.post('/add_rating', async (req, res) => {
  data = req.body.data
  try {
    let userRated = await User.findOne({ username: data.rated_id }).exec()
    data.rated_id = userRated.id
    let historyLen = await findHistoryLength(userRated.id, userRated.role)
    if (historyLen > 4 && userRated.role != 'nani') {
      let rating_sum = await calculateRate(userRated.id, data.sum_rating, userRated.role)
      await Parent.findOneAndUpdate({ id: userRated.id }, { $set: { rating: rating_sum }, $push: { history: data } }).exec()
    }
    else if (historyLen < 5 && userRated.role != 'nani') {
      await Parent.findOneAndUpdate({ id: userRated.id }, { $push: { history: data } }).exec()
    }
    else if (historyLen > 4 && userRated.role == 'nani') {
      let rating_sum = await calculateRate(userRated.id, data.sum_rating, userRated.role)
      await Nani.findOneAndUpdate({ id: userRated.id }, { $set: { rating: rating_sum }, $push: { history: data } }).exec()
    }
    else if (historyLen < 5 && userRated.role == 'nani') {
      await Nani.findOneAndUpdate({ id: userRated.id }, { $push: { history: data } }).exec()
    }
    let historyData = new HistoryRate(data)
    historyData.save(data);
    res.json({ 'success': true })
  } catch (error) {
    return { 'success': false }, error

  }


})




async function calculateRate(id, crn_rate, role) {
  let doc = role != 'nani' ?
    await Parent.findOne({ id: id }).exec() :
    await Nani.findOne({ id: id }).exec();
  let history = await doc.history;
  let totalRating = history.reduce((acc, cur) => acc + cur.sum_rating, +crn_rate);
  return totalRating / (history.length + 1);
}
async function findHistoryLength(id, role) {
  let doc = role != 'nani'
    ? await Parent.findOne({ id: id }).exec()
    : await Nani.findOne({ id: id }).exec();
  let historyLen = doc.history;
  return historyLen.length;
}
function findNaniById(id) {
  return Nani.findOne({ id: id })
}
function findParentById(id) {
  return Parent.findOne({ id: id })
}
module.exports = router;