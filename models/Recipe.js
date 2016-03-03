var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var recipeSchema = mongoose.Schema({
    name: {type: String, required: true},
    author: {type: ObjectId, ref: 'login'},
    ingredients:[{
      adjective: {type: ObjectId, ref: 'adjective'},
      ingredient: {type: ObjectId, ref: 'ingredient'},
      amount: {type: Number, required: true},
      unit: {type: ObjectId, ref: 'unit'}
    }],
    directions:[{
      verb: {type: ObjectId, ref: 'verb'},
      utensil: {type: ObjectId, ref: 'utensil'},
      time: {type: Number, required: true}
    }]
});


var Recipe = mongoose.model('recipe', recipeSchema);

module.exports = Recipe;
