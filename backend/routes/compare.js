const express = require("express");
const router = express.Router();
const { compareColleges } = require("../controllers/compareController");

router.post("/", compareColleges);

module.exports = router;