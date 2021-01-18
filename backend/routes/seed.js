const express = require("express");
const seedController = require("../controllers/seed");

const router = express.Router();

router.get("/", seedController.getIndex);

module.exports = router;
