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
