module.exports = function(models, ObjectId){

  var callback = function(){}

  models.Recipe.remove({}, callback);
  models.Verb.remove({}, callback);
  models.ID.remove({}, callback);
  models.Adjective.remove({}, callback);
  models.Ingredient.remove({}, callback);
  models.Unit.remove({}, callback);
  models.Utensil.remove({}, callback);

  var login = {
    _id: new ObjectId(),
    local: {
      email: "rogercores@gmail.com",
      password: "timex"
    }
  };

  var utensil1 = {
    _id: new ObjectId(),
    name: "skillet"
  };

  var utensil2 = {
    _id: new ObjectId(),
    name: "pan"
  };

  var unit1 = {
    _id: new ObjectId(),
    name: "litre"
  };

  var unit2 = {
    _id: new ObjectId(),
    name: "kg"
  };

  var ingredient1 = {
    _id: new ObjectId(),
    name: "tomato"
  };

  var ingredient2 = {
    _id: new ObjectId(),
    name: "potato"
  };

  var adjective1 = {
    _id: new ObjectId(),
    name: "smashed"
  };

  var adjective2 = {
    _id: new ObjectId(),
    name: "peeled"
  };

  var verb1 = {
    name: "saute",
    timeMandatory: true
  };

  var verb2 = {
    name: "add"
  };

  new models.Verb(verb1).save(callback);
  new models.Verb(verb2).save(callback);
  new models.Adjective(adjective1).save(callback);
  new models.Adjective(adjective2).save(callback);
  new models.Ingredient(ingredient1).save(callback);
  new models.Ingredient(ingredient2).save(callback);
  new models.Unit(unit1).save(callback);
  new models.Unit(unit2).save(callback);
  new models.Utensil(utensil1).save(callback);
  new models.Utensil(utensil2).save(callback);
  new models.ID(login).save(callback);
}
