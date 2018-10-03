'use strict'
const Dish = require('../models/dish.model');

function query(req, res, next) {
    let queryObj ={};
    let dishNameQuery = req.body.name;
    queryObj.name = new RegExp(dishNameQuery, 'i');
    queryObj.status = 'VERIFIED';
    Dish.find(queryObj).exec().then(results => {
        console.log(results);
        res.status(200).json(results);
    }).catch(error => {
        console.log(error);
    });
}

function create(req, res, next) {
  let data = {
    name : req.body.suggestedDishName,
    value : req.body.suggestedDishName,
    label : req.body.suggestedDishName,
    status : 'UNVERIFIED'
  }
  const dish = new Dish(data);
  dish.save()
    .then(savedDish => res.json(savedDish))
    .catch(e => next(e));
}


module.exports = { query, create };