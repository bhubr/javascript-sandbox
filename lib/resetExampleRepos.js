const Promise     = require('bluebird');
const path        = require('path');
const execAsync   = require('./execAsync');
const appRoot     = path.normalize(__dirname + '/..');
const isTesting   = process.env.NODE_ENV === 'testing';
const examplesDir = ! isTesting ? appRoot + '/exemples' :
  appRoot + '/test/integration/test-examples';

// Promisified exec of git mv src dst
function gitStatusAsync(src, dst) {
  var cmd = 'git status ' + examplesDir;
  return execAsync(cmd)
  // .then(({ stdout, stderr }) => {
  //   // console.log(`stdout: ${stdout}`);
  //   // console.log(`stderr: ${stderr}`);
  // })
  .catch(error => {
    console.error(`exec error: ${error}`);
    throw error;
  });  
}

function getUntrackedReposAndExamples() {
  return gitStatusAsync()
  .then(({ stdout }) => {
    let idx = stdout.indexOf('Untracked files:');
    const output = stdout.substr(idx);
    let files = output.split('\n');

    files.splice(0, 3);
    idx = 0;
    while(files[idx]) idx++;
    files.splice(idx, files.length - idx);
    files.forEach((line, i) => {
      files[i] = line.trim();
    });
    return files;
  });
}

function resetExampleRepos() {
  return getUntrackedReposAndExamples()
  .then(files => Promise.map(files,
    file => execAsync('rm -r ' + appRoot + '/' + file)
    // file => console.log('rm -r ' + appRoot + '/' + file)
  ))
}

module.exports = resetExampleRepos;