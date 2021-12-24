const mongoose = require("mongoose");
const config = require("../../db/dbConfig");

const { userM, wordM } = require("./model");

function connect() {
  const { host, database } = config;
  return mongoose.createConnection(
    host + "/" + database,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
    (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log("数据库连接成功");
      }
    }
  );
}

const userModel = connect().model("user", userM);
const wordModel = connect().model("word", wordM);

module.exports = {
  userModel,
  wordModel,
};
