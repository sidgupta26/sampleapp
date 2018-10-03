'use strict'
const Business = require('../models/business.model');
var changeCase = require('change-case');

/**
 * Load business and append to req.
 */
function load(req, res, next) {
  Business.findById(req.params.businessId).exec()
    .then((business) => {
      res.status(200).json(business); // eslint-disable-line no-param-reassign
    })
    .catch(e => console.log(e));
}

/**
 * Get Business
 * @returns {Business}
 */
function get(req, res) {
  return res.json(req.business);
}

/**
 * Create new business
 * @property {Business} req.body - The business object.
 * @returns {Business}
 */
function create(req, res, next) {
  let data = {
    ...req.body,
    geospatialdata: {
      type: "Point",
      coordinates: [req.body.location.geocoordinates.lng,
      req.body.location.geocoordinates.lat
      ]
    },
    businessName : changeCase.titleCase(req.body.businessName),
    description : changeCase.sentenceCase(req.body.description)
  }
  const business = new Business(data);
  business.save()
    .then(savedBusiness => res.json(savedBusiness))
    .catch(e => next(e));
}

/**
 * Get business list.
 * @property {number} req.query.skip - Number of vendors to be skipped.
 * @property {number} req.query.limit - Limit number of vendors to be returned.
 * @returns {Vendor[]}
 */
function list(req, res, next) {
  const { limit = 50, skip = 0 } = req.query;
  Business.list({ limit, skip })
    .then(businesses => res.json(businesses))
    .catch(e => next(e));
}

/**
 * Delete Business.
 * @returns {Business}
 */
function remove(req, res, next) {
  const business = req.business;
  Business.remove()
    .then(deletedBusiness => res.json(deletedBusiness))
    .catch(e => next(e));
}

/**
 * Update Business.
 * @returns {Business}
 */
function update(req, res, next) {
  const id = req.params.businessId;
  var business = req.body;
  if (business && business.location && business.location.geocoordinates && business.location.geocoordinates.lng) {
    business = {
      ...business, coordinates: [
        business.location.geocoordinates.lng, business.location.geocoordinates.lat
      ]
    }
  }
  // if image urls are present, rest of the data will not be present
  if(business && business.imageUrls && business.imageUrls.length>0 && (!business.businessName || business.businessName.trim() === '')){
    business = {
      $push: { imageUrls: business.imageUrls[0] }
    }
  }
  Business.findByIdAndUpdate(
    // the id of the item to find
    id,
    // the change to be made. Mongoose will smartly combine your existing 
    // document with this change, which allows for partial updates too
    business,
    // an option that asks mongoose to return the updated version 
    // of the document instead of the pre-updated one.
    { new: true },

    // the callback function
    (err, business) => {
      // Handle any possible database errors
      if (err) return res.status(500).send(err);
      return res.send(business);
    });
}


function updateImageUrls(req, res, next) {
  let business = {
    imageUrls: [req.body.imageUrl]
  }
  Business.findByIdAndUpdate(
    // the id of the item to find
    req.params.businessId,
    // the change to be made. Mongoose will smartly combine your existing 
    // document with this change, which allows for partial updates too
    { $push: { imageUrls: imageUrl } },
    // an option that asks mongoose to return the updated version 
    // of the document instead of the pre-updated one.
    { new: true },

    // the callback function
    (err, business) => {
      // Handle any possible database errors
      if (err) return res.status(500).send(err);
      return res.send(business);
    });
}

function query(req, res, next) {
  let searchTerm = req.body.searchTerm ? req.body.searchTerm : '';
  let lat = req.body.searchLat;
  let lng = req.body.searchLng;

  let queryObj = {};

  if (searchTerm && searchTerm.trim() !== '') {
    queryObj = {
      ...queryObj, $or: [
        { businessName: new RegExp(searchTerm, 'i') },
        { description: new RegExp(searchTerm, 'i') },
        {
          "foodoptions.cuisine":
          { $in: [new RegExp(searchTerm, 'i')] }
        },
        {
          "foodoptions.beverages":
          { $in: [new RegExp(searchTerm, 'i')] }
        },
        {
          "foodoptions.dishtype":
          { $in: [new RegExp(searchTerm, 'i')] }
        },
        {
          "foodoptions.flavor":
          { $in: [new RegExp(searchTerm, 'i')] }
        },
        {
          "foodoptions.mealtype":
          { $in: [new RegExp(searchTerm, 'i')] }
        },
        {
          "dishes.value":
          { $in: [new RegExp(searchTerm, 'i')] }
        },
      ]
    }
  }
  queryObj.geospatialdata = {
    $near: {
      $maxDistance: 100000,
      $geometry: {
        type: "Point",
        coordinates: [lng, lat]
      }
    }
  }

  Business.find(queryObj).exec().then(results => {
    res.status(200).json(results);
  }).catch(error => {
    console.log(error);
  });
}



module.exports = { load, get, create, list, remove, updateImageUrls, update, query };
