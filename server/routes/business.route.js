const express = require('express');
const validate = require('express-validation');
const multer = require('multer');
const businessCntroller = require('../controllers/business.controller');
const Business = require('../models/business.model');
const router = express.Router();

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './businessimages');
  },
  filename: function (req, file, cb) {
    var fullFileName = file.originalname;
    var fileName = fullFileName.split(".")[0];
    var fileExtension = fullFileName.split(".")[1];
    cb(null, fileName + Date.now() + "." + fileExtension);
  }
});

const upload = multer({ storage: storage });

router.route('/')
  .get(businessCntroller.list)
  .post(businessCntroller.create);

router.route('/:businessId')
  /** GET /api/business/:businessId - Get business */
  .get(businessCntroller.load)
  .put(businessCntroller.update)

router.route('/:businessId/images')
  .post(businessCntroller.updateImageUrls)
  .get(function () {
    console.log('Load all images. This is not implemented yet');
  });

router.route('/query')
  .post(businessCntroller.query)

module.exports = router;
