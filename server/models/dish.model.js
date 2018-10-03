const mongoose = require('mongoose');

/**
 * Dish Schema
 */
const DishSchema = new mongoose.Schema({
    name: String,
    label: String,
    value : String, 
    status :String
});

/**
 * @typedef Dish
 */
module.exports = mongoose.model('Dish', DishSchema, 'dish');
