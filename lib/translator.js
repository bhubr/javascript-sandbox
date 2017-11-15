var fs       = require('fs');
var path     = require('path');
var langDir  = path.normalize(__dirname + '/../languages');
var locales  = fs.readdirSync(langDir)
               .map(locale => path.basename(locale, '.json'));
var vsprintf = require('sprintf-js').vsprintf;
var langs    = locales.reduce((carry, locale) =>
  Object.assign(carry, { [locale]: require(langDir + '/' + locale + '.json') }),
  {}
);

module.exports = {
  getOne: function(locale, string, args) {
    locale = locales.indexOf(locale) > -1 ? locale : 'en-US';
    const translation = langs[locale][string];
    return translation ? vsprintf(translation, args) : 'N/A';
  },
  getAll: function(locale) {
    locale = locales.indexOf(locale) > -1 ? locale : 'en-US';
    return langs[locale];
  }
};