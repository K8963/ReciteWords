const boom = require("boom");
const { wordModel } = require("../utils/db/db");
const { body, validationResult } = require("express-validator");
const { fsExistsSync, createFs, writeFs } = require("../utils/fs");
const path = require("path");
const fs = require("fs");

const {
  CODE_ERROR,
  CODE_SUCCESS,
  PRIVATE_KEY,
  JWT_EXPIRED,
} = require("../utils/constant");

const get = async (req, res, next) => {
  const err = validationResult(req);
  if (!err.isEmpty()) {
    const [{ msg }] = err.errors;
    next(boom.badRequest(msg));
  } else {
    let findId;
    if (req.query.id) {
      findId = { _id: req.query.id };
    } else {
      findId = null;
    }
    const result = await wordModel
      .find(findId)
      .then((res) => {
        return res;
      })
      .catch((err) => {
        console.log(err);
        return [];
      });
    if (result) {
      res.json({
        code: CODE_SUCCESS,
        msg: "查询成功",
        data: {
          result,
        },
      });
    } else {
      res.json({
        code: CODE_ERROR,
        msg: "查询失败",
        data: null,
      });
    }
  }
};
const add = (req, res, next) => {
  const err = validationResult(req);
  if (!err.isEmpty()) {
    const [{ msg }] = err.errors;
    next(boom.badRequest(msg));
  } else {
    // console.log(req.body);
    const wordBody = req.body;
    const insertObj = new wordModel(wordBody);
    const result = insertObj
      .save()
      .then((rs) => {
        return rs;
      })
      .catch((err) => {
        console.log(err);
        return false;
      });
    if (result) {
      res.json({
        code: CODE_SUCCESS,
        msg: "创建成功",
        data: {
          mean: wordBody.mean,
          type: wordBody.type,
          word: wordBody.word,
          tag: wordBody.tag,
          user: wordBody.user,
          similar: wordBody.similar,
        },
      });
    } else {
      res.json({
        code: CODE_ERROR,
        msg: "创建失败",
        data: null,
      });
    }
  }
};
const del = (req, res, next) => {
  const err = validationResult(req);
  if (!err.isEmpty()) {
    const [{ msg }] = err.errors;
    next(boom.badRequest(msg));
  } else {
    if (req.body.id) {
      const id = req.body.id;
      wordModel.deleteOne({ _id: id }, (err) => {
        if (err) {
          res.json({
            code: CODE_ERROR,
            msg: "删除失败",
            data: {
              error: err,
            },
          });
        } else {
          res.json({
            code: CODE_SUCCESS,
            msg: "删除成功",
            data: {
              id: id,
            },
          });
        }
      });
    } else {
      res.json({
        code: CODE_ERROR,
        msg: "未找到目标项",
        data: null,
      });
    }
  }
};

const setJson = async (req, res, next) => {
  const err = validationResult(req);
  const pathF = "../data";
  if (!err.isEmpty()) {
    const [{ msg }] = err.errors;
    next(boom.badRequest(msg));
  } else {
    // 判断文件夹是否存在
    if (!fsExistsSync(pathF)) {
      // 创建文件夹
      createFs(pathF);
    }
    // 获取数据
    const result = await wordModel
      .find()
      .then((res) => {
        return res;
      })
      .catch((err) => {
        console.log(err);
        return [];
      });

    // 创建 json 文件
    let jsonPath = pathF + "/word.json";
    let content = '{"result":' + JSON.stringify(result) + "}";
    let writeRes = writeFs(jsonPath, content);
    let resPath = path.resolve(jsonPath);

    if (writeRes) {
      res.json({
        code: CODE_SUCCESS,
        msg: "导出成功",
        data: {
          resPath: resPath,
        },
      });
    } else {
      res.json({
        code: CODE_ERROR,
        msg: "导出失败",
      });
    }
  }
};

module.exports = {
  add,
  get,
  del,
  setJson,
};
