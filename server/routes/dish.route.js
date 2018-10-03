const express = require('express');
const validate = require('express-validation');
const dishCntroller = require('../controllers/dish.controller');
const router = express.Router();


router.route('/query')
  .post(dishCntroller.query);

router.route('/')
  .post(dishCntroller.create);

module.exports = router;
