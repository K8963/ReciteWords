const express = require(`express`);

const service = require("../services/wordService.js");

const router = express.Router();

router.get("/get", service.get);
router.post("/add", service.add);
router.post("/del", service.del);
router.get("/set", service.setJson);

module.exports = router;
