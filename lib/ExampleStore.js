const {
  scandirAsync
}               = require('./fsio');
const Promise   = require('bluebird');
const _         = require('lodash');
const beautify  = require('json-beautify');
const fs        = require('fs');
const path      = require('path');

function ExampleStore(path) {
  this.rootPath = path;
  this.repos = [];
}

ExampleStore.prototype.init = function() {
  const loadRepository = this.loadRepository.bind(this);
  return scandirAsync(this.rootPath, ['.gitkeep'])
  .then(repositories => Promise.map(
    repositories, loadRepository
  ));
};

ExampleStore.prototype.loadRepository = function(repoPath) {
  const loadExample    = this.loadExample.bind(this);
  const fullPath       = this.rootPath + '/' + repoPath;
  const repoConfig     = require(fullPath + '/repo-config.json');
  const repoDescriptor = Object.assign(repoConfig, {
    path: repoPath,
    fullPath,
    examples: []
  });
  this.repos.push(repoDescriptor);
  return scandirAsync(fullPath, ['.gitkeep', 'repo-config.json'])
  .then(examples => Promise.map(
    examples, example => loadExample(repoDescriptor, example)
  ));
  // .then(() => console.log(this.repos[0]))
};

ExampleStore.prototype.addRepository = function(repoPath, repoDescriptor) {

  // Prepare files to write
  const self = this;
  const fullPath = this.rootPath + '/' + repoPath;
  const repoConfigFile = fullPath + '/repo-config.json';
  const repoConfig = beautify(repoDescriptor, null, 2, 100);

  // Add repo path to descriptor
  repoDescriptor.path = repoPath;
  repoDescriptor.fullPath = this.rootPath + '/' + repoPath;
  
  return fs.mkdirAsync(fullPath)
  .then(() => fs.writeFileAsync(repoConfigFile, repoConfig))
  .then(() => self.repos.push(repoDescriptor));
}

ExampleStore.prototype.loadExample = function(repo, slug) {
  const exampleConfig = require(repo.fullPath + '/' + slug + '/config.json');
  repo.examples.push(Object.assign({ slug }, exampleConfig));
  return exampleConfig;
};

ExampleStore.prototype.addExampleFile = function(repoSlug, slug, filename) {
  const repo    = this.getRepo(repoSlug);
  const example = _.find(repo.examples, { slug });
  let ext       = path.extname(filename).substr(1);
  const target  = repo.fullPath + '/' + slug + '/config.json';
  example[ext].push(filename);
  console.log('after adding file', _.find(repo.examples, { slug }));
  const config = _.clone(example);
  delete config.slug;
  configJSON = beautify(config, null, 2, 100);
  return fs.writeFileAsync(target, configJSON);
};

ExampleStore.prototype.getList = function(path) {
  return _.find(this.repos, { path });
}

ExampleStore.prototype.getRepoMenu = function(path) {
  return this.repos.map(
    ({ title, path }) => ({ title, path })
  )
};

ExampleStore.prototype.getExampleMenu = function(path) {
  const repo = _.find(this.repos, { path });
  if(! repo.categories) {
    console.error('Repo ' + repo.title + 'has no categories key');
    return [];
  }
  console.log('getExampleMenu repo examples', repo.examples)
  const menu = repo.categories.map(category => {
    const examplesInCat = repo.examples.filter(ex => (ex.category === category.slug));
    // console.log('examples in cat', category, examplesInCat);
    const examples = examplesInCat.map(
    ({ title, slug }) => ({ title, slug: repo.path + '/' + slug }) 
  );
    return { category, examples };
  });
  // console.log(menu);
  return menu;
  // return repo.examples.map(
  //   ({ title, slug }) => ({ title, slug: repo.path + '/' + slug }) 
  // );
};

ExampleStore.prototype.getMenu = function(path) {
  const self = this;
  return '<ul>' + self.repos.reduce((menu, repo) => {
    return menu + '<li>'+ repo.title + '<ul>' + repo.examples.reduce((submenu, example) =>
      (submenu + '<li><a href="#' + repo.path + '/' + example.slug  + '">' + example.title + '</a></li>'),
    '') + '</ul></li>';
  }, '') + '</ul>';
}

ExampleStore.prototype.getRepo = function(path) {
  return _.find(this.repos, { path });
}

module.exports = ExampleStore;