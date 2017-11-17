const Promise = require('bluebird');
const bcrypt  = Promise.promisifyAll(require('bcrypt'));

const SALT_WORK_FACTOR = 10;

function throwIfFalsy(errorMsg) {
  return value => {
    if(! value) {
      throw new Error(errorMsg);
    }
    return value;
  };
}

function hashPasswordAsync(password) {
  return bcrypt.genSaltAsync(SALT_WORK_FACTOR)
  .then(salt => bcrypt.hashAsync(password, salt));
}

function matchPasswordAsync(user, password) {
  return bcrypt.compare(password, user.password)
  .then(throwIfFalsy('Wrong password'))
  .then(() => (user));
}

module.exports = {
  hash: hashPasswordAsync,
  match: matchPasswordAsync
};