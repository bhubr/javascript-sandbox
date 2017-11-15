/* global __dirname */
"use strict";
var _             = require('lodash');
var Mustache      = require('mustache');
var path          = require('path');
var fs            = require('fs');
var chokidar      = require('chokidar');
var indexTmplPath = path.normalize(__dirname + '/../html/index.mustache.html');
var indexTpml;
var {
  readFilesAsync
}                 = require('../lib/fsio');
var translator    = require('../lib/translator');
var passLog       = require('../lib/passLog');

// One-liner for current directory, ignores .dotfiles
chokidar.watch('./html', {ignored: /(^|[\/\\])\../}).on('all', (event, path) => {
  // console.log(event, path);
  if(path === 'html/index.mustache.html') {
    console.log('reload index html');
    indexTpml = fs.readFileSync(indexTmplPath).toString();
  }
});


module.exports = function(exStore, exDir, testMode) {

  function readExampleFiles(repoSlug, exampleSlug, config) {
    const exampleDir = exDir + '/' + repoSlug + '/' + exampleSlug;
    const libsCssDir = path.normalize(__dirname + '/../css/vendor');
    const libsJsDir  = path.normalize(__dirname + '/../js/vendor');
    const { html, js, css } = config; // libsCss, libsJs 

    const files = [].concat(html, js, css);
    return readFilesAsync(exampleDir, files);
  }

  function renderIndex(req, withRepo, withExample) {

    // Extract repoSlug and exampleSlug from req.params
    const { locale, params: { repoSlug, exampleSlug } } = req;
    let repo;
    let menuExample;
    let statusCode;
    const menuRepo = exStore.getRepoMenu();
    const translations = translator.getAll(locale);

    // Initialize view data
    let data = {
      menuRepo,
      reposJSON: JSON.stringify(menuRepo),
      repoJSON: 'null',
      exampleJSON: 'null',
      testMode,
      testRun: testMode && req.query.testing,
      appPath: req.path,
      _: translations,
      _JSON: JSON.stringify(translations)
    };

    // Fetch example repository if needed
    if(withRepo) {
      data.repo = exStore.getRepo(repoSlug);
      data.repoJSON = JSON.stringify(data.repo);
      if(! data.repo) {
        // return res.status(404).send('Repo ' + req.params.repoSlug + ' not found');
        data.errorMessage = translator.getOne(locale, "repoNotFound", [repoSlug]); //'Repo ' + params.repoSlug + ' not found';
        statusCode = 404;
      }
      else {
        data.menuExample = exStore.getExampleMenu(data.repo.path);
        data.showControls = true;
      }
    }

    // Fetch example if needed
    if(withExample && data.repo) {
      data.example = _.find(data.repo.examples, { slug: exampleSlug });
      data.exampleJSON = JSON.stringify(data.example);
      if(! data.example) {
        // return res.status(404).send('Example ' + req.params.repoSlug + '/' + req.params.exampleSlug + ' not found');
        data.errorMessage = translator.getOne(locale, "exampleNotFound", [repoSlug, exampleSlug]);
        statusCode = 404;
      }
      else {
        data.showEditor = true;
      }
    }
    data.showShortcutExample = data.repo && ! data.example;

    // Mustache.render(indexTpml, data);
    return (
      exampleSlug && data.example ?
        readExampleFiles(repoSlug, exampleSlug, data.example) : Promise.resolve([])
    ).then(files =>
      ({ files, filesJSON: JSON.stringify(files) })
    )
    .then(({ files, filesJSON }) => Object.assign(data, { files, filesJSON }))
    .then(passLog('data before rendering, path: ' + req.path))
    .then(data => ({
      html: Mustache.render(indexTpml, data),
      code: statusCode ? statusCode : 200
    }));
  }

  return {


    /**
     * Extract language header from req
     */
    getAcceptLanguage: function (req, res, next) {
      const acceptLanguageHdr = req.headers["accept-language"];
      const re = /[a-z]{2}\-[A-Z]{2}/;
      const matches = re.exec(acceptLanguageHdr);
      if(matches) {
        req.locale = matches[0];
      }
      next();
    },


    /**
     * Get bare index without repo or examples
     */
    getIndexBare: function(req, res) {
      renderIndex(req)
      .then(({ html, code }) => res.send(html));
    },


    /**
     * Get index with repo selected only
     */
    getIndexRepo: function(req, res) {
      renderIndex(req, true)
      .then(({ html, code }) => res.status(code).send(html));
    },


    /**
     * Get index with selected repo&example
     */
    getIndexExample: function(req, res) {
      renderIndex(req, true, true)
      .then(({ html, code }) => res.status(code).send(html));
    }

  };

};