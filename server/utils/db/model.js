const userM = {
  date: { type: Date, default: Date.now },
  user: { type: String },
  pwd: { type: String },
};

const wordM = {
  mean: { type: String },
  type: { type: String },
  word: { type: String },
  tag: { type: String },
  user: { type: String },
  similar: { type: String },
  date: { type: Date, default: Date.now },
};

module.exports = { userM, wordM };
