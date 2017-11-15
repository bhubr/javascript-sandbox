/* global __dirname */
/* jshint strict:false */
"use strict";
var express       = require('express');
var bodyParser    = require('body-parser');
var slug          = require('slug');
var beautify      = require('json-beautify');
var _             = require('lodash');
var path          = require('path');
var Mustache      = require('mustache');
var app           = express();
var fs            = require('fs');
var Promise       = require('bluebird'); Promise.promisifyAll(fs);
var sandboxTpml   = fs.readFileSync(__dirname + '/html/template.mustache.html').toString();
var exampleTmpl   = require('./lib/exampleTmpl.json');
var repoTmpl      = require('./lib/repoTmpl.json');
var ExampleStore  = require('./lib/ExampleStore');
var resetExampleRepos = require('./lib/resetExampleRepos');
var isTesting     = process.env.NODE_ENV === 'testing';
var examplesDir   = ! isTesting ? __dirname + '/exemples' :
  __dirname + '/test/integration/test-examples';

var exStore       = new ExampleStore(examplesDir);
var {
  readFileAsync,
  readFilesAsync
}                 = require('./lib/fsio');
var {
  getAcceptLanguage,
  getIndexBare,
  getIndexRepo,
  getIndexExample
}                 = require('./lib/indexHandlers')(exStore, examplesDir, isTesting);
var {
  // getIndexBare,
  getPartsRepo,
  getPartsExample
}                 = require('./lib/partHandlers')(exStore, examplesDir);


/**
 * Initialize example store
 */
(function(doReset) {
  return doReset ? resetExampleRepos() : Promise.resolve(true);
})(isTesting)
.then(() => exStore.init());
// .then(() => console.log(exStore.getMenu()));


/**
 * Initialize Express app:
 *   - root folder as static
 *   - body parsers
 *   - browser language detection middleware
 */
app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(getAcceptLanguage);

function addExample(slug, title) {
  return fs.writeFileAsync(examplesJSON, beautify(examples, null, 2, 100));
}

function readConfigJson(exampleSlug) {
  console.log(exampleSlug);
  return require('./exemples/jquery/' + exampleSlug + '/config.json');
}

function mapObjToArray(obj, key, value) {
  var arr = [];
  for(var p in obj) {
    arr.push({
      [key]: p,
      [value]: obj[p]
    });
  }
  return arr;
}

function checkBodyPropsExist(props) {
  return function(req, res, next) {
    if(! props) {
      throw new Error('checkBodyPropsExist was called with empty props argument');
    }
    if(! req.body) {
      return res.status(400).send('request doest not have a body: please set "content-type" header to "application/json"');
    }
    props = typeof props === 'string' ? [props] : props;
    for(let p = 0 ; p < props.length ; p++) {
      const prop = props[p];
      if(! req.body[prop]) {
        return res.status(400).send('request body doest not have a `' + prop + '` parameter: please provide it.');
      }
    }
    next();
  };
}

function checkNameAndGetExt(filename) {
  const base = path.basename(filename);
  let ext    = path.extname(filename);
  ext = ext ? ext.toLowerCase().substr(1) : ext;
  return base && ['html', 'js', 'css'].indexOf( ext ) > -1 ? ext : false;
}

/**
 * Get repo parts
 */
app.get('/parts/:repoSlug', getPartsRepo);

/**
 * Get example parts
 */
app.get('/parts/:repoSlug/:exampleSlug', getPartsExample);


/**
 * Index page: render with only repo list in menu
 */
app.get('/', getIndexBare);

/**
 * Index page: render for tests
 */
// if(isTesting) {
//   app.get('/test', getIndexTest);
// }

/**
 * Repo page: render with repo list and selected repo's example list in menu
 */
app.get('/:repoSlug', getIndexRepo);

/**
 * Example page: render with repo list and selected repo's example list in menu,
 * and the editor with the selected example
 */
app.get('/:repoSlug/:exampleSlug', getIndexExample);


function checkRepoExists(req, res, next) {
  const { repoSlug } = req.params;
  console.log('### checkRepoExists', repoSlug);
  // Get repo from store
  req.repo = exStore.getRepo(repoSlug);
  if(! req.repo) {
    return res.status(404).send("Repo " + repoSlug + "not found");
  }
  next();
}


/**
 * Create a new repo
 */
app.post('/repos',
  checkBodyPropsExist('title'),
  function(req, res) {

    const { title } = req.body;
    const repoSlug  = slug(title.toLowerCase());
    const existingRepo = exStore.getRepo(repoSlug);
    // Prevent duplicate title
    if(existingRepo) {
      return res.status(409).send("La collection '" + title + "' existe déjà !");
    }

    // Prepare config
    var config = Object.assign({
      title,
      examples: []
    }, repoTmpl);

    exStore.addRepository(repoSlug, config)
    .then(repo => res.json(config));

  }
);

app.post('/:repoSlug/examples/:exampleSlug/files',
  checkRepoExists,
  checkBodyPropsExist('name'),
  function(req, res) {
    const { name } = req.body;
    const { repoSlug, exampleSlug } = req.params;
    const re = /^[A-Za-z0-9_\-\.]+$/;
    const targetDir = examplesDir + '/' + repoSlug + '/' + exampleSlug;
    const fullPath = targetDir + '/' + name;
    const defaultContents = {
      html: '<!-- ' + name + ' -->',
      js: '// ' + name,
      css: '/* ' + name + ' */',
    }
    let fileExt;
    if(! re.test(name)) {
      return res.status(400).json('Le paramètre `name` est incorrect: caractères autorisés: lettres, chiffres, _, - et .' );
    }
    if( ! ( fileExt = checkNameAndGetExt( name ) ) ) {
      return res.status(400).json("Le paramètre `name` est incorrect: il doit comporter un nom suivi d'une extension (.html, .js ou .css)" );
    }
    const fileContent = defaultContents[fileExt];
    fs.statAsync(fullPath)
    // Invert the usual flow of a Promise. fs.stat() fails if file does not exist (which is what we want)
    // Hence .catch() is a success handler and .then() an error handler (has to rethrow)
    .then(stats => {
      throw new Error('Le fichier `' + name + '` existe déjà !');
    })
    .catch(err => {
      // Rethrow error if it is not a "file not found" thrown by fs.stat()
      if( ! err.message.startsWith('ENOENT') ) {
        throw err;
      }
      return fs.writeFileAsync(fullPath, fileContent);
    })
    .then(() => exStore.addExampleFile(repoSlug, exampleSlug, name))
    .then(() => res.json({
        name,
        type: fileExt,
        // path: fullPath,
        content: fileContent
      })
    )
    .catch(err => {
      const statusCode = err.message.startsWith('Le fichier') ? 409 : 500;
      return res.status(statusCode).send(err.message);
    });
  }
);

app.put('/:repoSlug/examples/:exampleSlug/files/:name',
  checkRepoExists,
  checkBodyPropsExist('content'),
  function(req, res) {
    const { name } = req.params;
    const { content } = req.body;
    const { repoSlug, exampleSlug } = req.params;
    const re = /^[A-Za-z0-9_\-\.]+$/;
    const targetDir = examplesDir + '/' + repoSlug + '/' + exampleSlug;
    const fullPath = targetDir + '/' + name;
    return fs.writeFileAsync(fullPath, content)
    .then(() => res.json({ fullPath, name, content }));
  }
);

/**
 * Create a new example for specified repo
 */
app.post('/:repoSlug/examples', 
  checkRepoExists,
  checkBodyPropsExist('title'),
  function(req, res) {

    const { title }    = req.body;
    const { repoSlug } = req.params;

    // Prevent duplicate title
    var existingTitle = _.find(req.repo.examples, { title: title });
    if(existingTitle) {
      return res.status(409).send("L'exemple '" + title + "' existe déjà !");
    }
    var exampleSlug = slug(req.body.title.toLowerCase());

    // Prepare config
    var config = Object.assign({
      slug: exampleSlug,
      title,
      category: req.repo.defaultCategory
    }, exampleTmpl);

    // Prepare files to write
    var targetDir = examplesDir + '/' + repoSlug + '/' + exampleSlug;
    var files = mapObjToArray({
      'example.html': '<!-- ' + title + ' -->\n',
      'script.js': '// ' + title,
      'config.json': beautify(config, null, 2, 100)
    }, 'file', 'content');
    fs.mkdirAsync(targetDir)
    .then(() => Promise.map(
      files, ({ file, content }) => fs.writeFileAsync(targetDir + '/' + file, content)
    ))
    .then(files => req.repo.examples.push(config))
    .then(() => res.json(config));
  }
);

app.get('/examples/:repoSlug/:slug',
  checkRepoExists,
  function(req, res) {
    const { repoSlug, slug } = req.params;
    var example = _.find(req.repo.examples, { slug });
    const { title, html, js, css, libsCss, libsJs } = example;
    console.log(example, title, html, js, css, libsCss, libsJs);
    readFileAsync(examplesDir + '/' + repoSlug + '/' + slug + '/example.html')
    .then(body =>
      Mustache.render(sandboxTpml, {
        body, repoSlug, slug, title, js, css, libsCss, libsJs,
        examplesDir: path.relative(__dirname, examplesDir)
      })
    )
    .then(html => res.send(html))
    .catch(err => {
      console.error(err);
      res.status(500).send('Error: ' + err.message);
    });
  }
);




app.get('/menu', (rea, res) => {
  res.send(exStore.getMenu());
});

app.get('/list/:repoPath', function(req, res) {
  const { repoPath } = req.params;
  const repo = exStore.getList(repoPath);
  if(! repo) {
    return res.status(404).send('Repo ' + repoPath + ' not found');
  }
  console.log('found repo', repo);
  const data = repo.examples.map(e => (
    { slug: e.slug, title: e.title }
  ));
  res.json(data);
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