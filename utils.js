module.exports.contains = function(arr, val) {
    var index = arr.indexOf(val);
    if(index == -1) return false;
    else return true;
};


module.exports.remove = function(arr, val){
  var index = arr.indexOf(val);
  if (index >= 0) {
    arr.splice( index, 1 );
  }
}


module.exports.validateRefs = function(entityClass, object, done){

  var keys = Object.keys(object);

  var visitItem = function(index, responseArray){

    if(index<keys.length){
      console.log('key >>>>> '+ keys[index])
      if(entityClass.schema.paths[keys[index]].options.ref){
            var reference = entityClass.schema.paths[keys[index]].options.ref;
          var model = entityClass.base.models[reference];
          dbasehandlers.getOneEntity(model, object[keys[index]], function(response, err){
            if(err){
              console.log(err);
              //done(null,err);
              responseArray.push(err);
            } else if(!response){
              //done(null, {errmsg: 'Invalid Document reference'});
              console.log('Invalid doc');
              responseArray.push({errmsg: 'Invalid Document reference'});

            }
            visitItem(++index, responseArray);

          });
        }
        else visitItem(++index, responseArray);
      }
      else {
        done(responseArray);
      }
  };



  visitItem(0, new Array());


};
