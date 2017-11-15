const Promise  = require('bluebird');
const { exec } = require('child_process');

// Promisified exec
module.exports = function execAsync(cmd) {
  return new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        return reject(error);
      }
      resolve({ stdout, stderr });
    });
  });
}
