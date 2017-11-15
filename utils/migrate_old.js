const fs          = require('fs');
const path        = require('path');
const Promise     = require('bluebird');
const execAsync   = require('../lib/execAsync');
const examplesDir = path.normalize(__dirname + '/../exemples/jquery');
// const listJson    = require('../exemples/liste.json');
const beautify    = require("json-beautify");
Promise.promisifyAll(fs);

// Promisified exec of git mv src dst
function gitMvAsync(src, dst) {
  var cmd = 'git mv ' + src + ' ' + dst;
  execAsync(cmd)
  .then(({stdout, stderr}) => {
    console.log(`stdout: ${stdout}`);
    console.log(`stderr: ${stderr}`);
  })
  .catch(error => {
    console.error(`exec error: ${error}`);
    throw error;
  });  
}

// Promisified exec of git status
// execAsync('git status')
// .then(({stdout, stderr}) => {
//   console.log(`stdout: ${stdout}`);
//   console.log(`stderr: ${stderr}`);
// })
// .catch(error => {
//   console.error(`exec error: ${error}`);
// });


// rename all examples' html
// fs.readdirAsync(examplesDir)
// .then(dirContent => {
//   var excludes = ['liste.json', '.gitkeep', 'start-iframe.html', 'template.html'];
//   excludes.forEach(file => {
//     var idxInContent = dirContent.indexOf(file);
//     if(idxInContent !== -1) {
//       dirContent.splice(idxInContent, 1);
//     }
//   });
//   return dirContent;
// })
// .then(dirContent => Promise.map(dirContent, dir => {
//     const fullPath = examplesDir + '/' + dir;
//     const src = fullPath + '/contenu.html';
//     const dst = fullPath + '/example.html';
//     gitMvAsync(src, dst)
//   })
// )
// .catch(console.error);

function writeExampleConfig(slug) {
  var config = require(examplesDir + '/' + slug + '/config.json');
  var { title, category, html, js, css, libsJs, libsCss } = config;
  config = { title, category, html, js, css, libsJs, libsCss };
  // console.log(exampleConfig)
  // return new Promise((resolve, reject) => {
  //   const { slug, title } = example;
  //   const config = {
  //     title,
  //     html: ['example.html'],
  //     js: ['script.js'],
  //     css: [],
  //     libsCss: ['styles.css'],
  //     libsJs: ['jquery-3.2.1.min.js']
  //   };
    const configJson = beautify(config, null, 2, 100);
  //   // resolve(configJson);
  return fs.writeFileAsync(examplesDir + '/' + slug + '/config.json', configJson);
  // });
}

fs.readdirAsync(examplesDir)
.then(dirContent => {
  var excludes = ['liste.json', '.gitkeep', 'repo-config.json'];
  excludes.forEach(file => {
    var idxInContent = dirContent.indexOf(file);
    if(idxInContent !== -1) {
      dirContent.splice(idxInContent, 1);
    }
  });
  return dirContent;
})
.then(exampleList => Promise.map(exampleList, writeExampleConfig))
.then(filesPerExample => console.log(filesPerExample));