var fs        = require("fs");
var mongoose  = require('mongoose');
var models    = this;
var data      = require('./Data');

var masterData = ["Adjective", "Ingredient", "Unit", "Utensil"];

fs.readdirSync(__dirname + '/').forEach(function(file) {
  if (file.match(/\.js$/) !== null && file != 'Data.js' && file != 'connector.js') {
    var name = file.replace('.js', '');
    exports[name] = require('./'+name);
  }
});

for(var i=0; i<masterData.length; i++){
  exports[masterData[i]] = mongoose.model(masterData[i].toLowerCase(), data);
}
