module.exports = function(models, ObjectId){

  var callback = function(err){
    if(err)
      console.log(err);
  }

  models.Recipe.remove({}, callback);
  models.Verb.remove({}, callback);
  models.ID.remove({}, callback);
  models.Adjective.remove({}, callback);
  models.Ingredient.remove({}, callback);
  models.Unit.remove({}, callback);
  models.Utensil.remove({}, callback);
  models.Category.remove({}, callback);



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

  var category1 = {
    name: "Indian"
  };

  var category2 = {
    name: "Mexican"
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
  var newId = new models.ID();
  newId.local.email = "rogercores2@gmail.com";
  newId.nickname = "rogercores"
  newId.local.password = newId.generateHash("timex");

  newId.save(callback);
  new models.Category(category1).save(callback);
  new models.Category(category2).save(callback);

}
