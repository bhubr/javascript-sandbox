/* global __dirname */
"use strict";
var _             = require('lodash');
var Mustache      = require('mustache');
var path          = require('path');
var fs            = require('fs');
var {
  readFilesAsync
}                 = require('../lib/fsio');
var translator    = require('../lib/translator');
var passLog       = require('../lib/passLog');


module.exports = function(exStore, exDir) {

  function readExampleFiles(repoSlug, exampleSlug, config) {
    const exampleDir = exDir + '/' + repoSlug + '/' + exampleSlug;
    const libsCssDir = path.normalize(__dirname + '/../css/vendor');
    const libsJsDir  = path.normalize(__dirname + '/../js/vendor');
    const { html, js, css } = config; // libsCss, libsJs 

    const files = [].concat(html, js, css);
    return readFilesAsync(exampleDir, files);
  }

  function renderPart(req, withRepo, withExample) {

    // Extract repoSlug and exampleSlug from req.params
    const { locale, params: { repoSlug, exampleSlug } } = req;
    let repo;
    let menuExample;
    let statusCode;

    // Initialize view data
    let data = {
      // menuRepo: exStore.getRepoMenu(),
      _: translator.getAll(locale)
    };

    // Fetch example repository if needed
    if(withRepo) {
      data.repo = exStore.getRepo(repoSlug);
      if(! data.repo) {
        // return res.status(404).send('Repo ' + req.params.repoSlug + ' not found');
        data.errorMessage = translator.getOne(locale, "repoNotFound", [repoSlug]); //'Repo ' + params.repoSlug + ' not found';
        statusCode = 404;
      }
      else {
        data.menuExample = exStore.getExampleMenu(data.repo.path);
      }
    }

    // Fetch example if needed
    if(withExample && data.repo) {
      data.example = _.find(data.repo.examples, { slug: exampleSlug });
      if(! data.example) {
        // return res.status(404).send('Example ' + req.params.repoSlug + '/' + req.params.exampleSlug + ' not found');
        data.errorMessage = translator.getOne(locale, "exampleNotFound", [repoSlug, exampleSlug]);
        statusCode = 404;
      }
    }

    // Mustache.render(indexTpml, data);
    return (
      exampleSlug && data.example ?
        readExampleFiles(repoSlug, exampleSlug, data.example) : Promise.resolve([])
    ).then(files => Object.assign(data, { files }))
    .then(passLog('data before rendering parts, path: ' + req.path));
  }

  return {


    /**
     * Get bare index without repo or examples
     */
    // getIndexBare: function(req, res) {
    //   renderIndex(req)
    //   .then(({ html, code }) => res.send(html));
    // },


    /**
     * Get index with repo selected only
     */
    getPartsRepo: function(req, res) {
      renderPart(req, true)
      .then(data => res.json(data));
    },


    /**
     * Get index with selected repo&example
     */
    getPartsExample: function(req, res) {
      renderPart(req, true, true)
      .then(data => res.json(data));
    }

  };

};