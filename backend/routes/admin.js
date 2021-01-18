const express = require("express");
const adminController = require("../controllers/admin");

const router = express.Router();

router.get("/", adminController.getIndex);

router.put("/update-word", adminController.updateWordDefinition);

module.exports = router;
