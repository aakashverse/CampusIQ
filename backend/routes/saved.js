const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/auth");
const { toggleSave, getSaved, getSavedIds } = require("../controllers/savedController");

// All saved routes require auth
router.use(authenticate);

router.get("/", getSaved);
router.get("/ids", getSavedIds);
router.post("/:collegeId", toggleSave);

module.exports = router;