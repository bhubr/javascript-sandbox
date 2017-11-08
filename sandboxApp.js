var express      = require('express');
var bodyParser   = require('body-parser');
var slug         = require('slug');
var beautify     = require("json-beautify");
var _            = require('lodash');
var fs           = require('fs');
var app          = express();
var examplesJSON = __dirname + '/exemples/liste.json';
var examples     = require(examplesJSON);

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

function addExample(slug, title) {
  examples.push({ slug: slug, title: title });
  fs.writeFileSync(examplesJSON, beautify(examples, null, 2, 100));
}

app.post('/examples', function(req, res) {
  var title = req.body.title;
  if(! req.body.title) {
    res.status(400).send('Le titre ne peut pas être vide !');
  }
  var existingTitle = _.find(examples, { title: title });
  if(existingTitle) {
    res.status(400).send("L'exemple '" + title + "' existe déjà !");
  }
  var exampleSlug = slug(req.body.title.toLowerCase());
  var targetDir = __dirname + '/exemples/' + exampleSlug;

  fs.mkdirSync(targetDir);
  fs.writeFileSync(targetDir + '/contenu.html', '');
  fs.writeFileSync(targetDir + '/script.js', '');
  addExample(exampleSlug, title);
  res.json({ slug: exampleSlug, title: title });
});

app.put('/examples/:slug', function(req, res) {
  var slug = req.params.slug;
  var existing = _.find(examples, { slug: slug });
  if(! existing) {
    res.status(404).send("L'exemple avec l'identifiant '" + slug + "' est introuvable !");
  }
  var targetDir = __dirname + '/exemples/' + slug;
  if(req.body.html) {
    fs.writeFileSync(targetDir + '/contenu.html', req.body.html);
  }
  if(req.body.javascript) {
    fs.writeFileSync(targetDir + '/script.js', req.body.javascript);
  }
  var theDate = new Date();
  console.log(theDate.getHours() + ':' + theDate.getMinutes() + " - Sauvegarde de l'exemple '" + existing.title + " effectuée'");
  res.json({ success: true });
});

module.exports = app;