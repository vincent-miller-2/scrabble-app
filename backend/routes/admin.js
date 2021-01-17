const express = require("express");
const adminController = require("../controllers/admin");

const router = express.Router();

router.get("/", adminController.getIndex);

router.get("/add-word", adminController.getAddWord);

router.post("/add-word", adminController.postWord);

module.exports = router;
