(function() {
  module.exports.register = function(Handlebars, options) {
    Handlebars.registerHelper('contains', function(strA, strB) {
      return strA.indexOf(strB) > -1;
    });
  };
}).call(this);
