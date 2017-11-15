module.exports = function(label) {
  return function(o) {
    console.log('####', label, o);
    return o;
  }
}