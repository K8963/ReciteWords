const fs = require("fs");

let fsExistsSync = (path) => {
  try {
    fs.accessSync(path, fs.F_OK);
  } catch (e) {
    return false;
  }
  return true;
};

const createFs = (path) => {
  fs.mkdir(path, (err) => {
    console.log(err);
  });
};

const writeFs = (path, content) => {
  try {
    fs.writeFile(path, content, (err) => {
      return err;
    });
  } catch (e) {
    return false;
  }
  return true;
};

module.exports = {
  fsExistsSync,
  createFs,
  writeFs,
};
