/**
 * This has to be required *after* using Bluebird's promisifyAll() on fs
 */
var fs      = require('fs');
var path    = require('path');
var Promise = require('bluebird');

if(typeof fs.readdirAsync !== 'function') {
  // console.error("scandirAsync module requires promisifying fs with Bluebird's Promise.promisifyAll()");
  Promise.promisifyAll(fs);
}

function scandirAsync(path, excludes) {
  excludes = excludes || [];
  return fs.readdirAsync(path)
  .then(dirContent => {
    excludes.forEach(file => {
      var idxInContent = dirContent.indexOf(file);
      if(idxInContent !== -1) {
        dirContent.splice(idxInContent, 1);
      }
    });
    return dirContent;
  });
}

function readFileAsync(file) {
  console.log('readFileAsync', file);
  // var fs = {
  //   readFileAsync: function() {
  //     return new Promise((resolve, reject) => {
  //       // resolve('pouet');
  //       reject(new Error('pouet error'))
  //     });
  //   }
  // }
  return fs.readFileAsync(file)
  .then(buf => (buf.toString()));
  // .then(str => {
  //   console.log('read file: ', str); return str;
  // });
}

function readFilesAsync(fullPath, files) {
  // console.log('reading files', files, 'from path', path);
  return Promise.reduce(files,
    (carry, f) => readFileAsync(fullPath + '/' + f)
      .then(content => 
        (carry.concat([{
          type: path.extname(f).substr(1),
          name: f,
          content
        }]))
      ),
    []
  );
}

module.exports = {
  scandirAsync,
  readFileAsync,
  readFilesAsync
};