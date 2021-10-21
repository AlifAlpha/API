const express = require("express");
const { signin, signout } = require("../controllers/auth");

const router = express.Router();

router.post("/auth", signin);
//llll
router.get("/auth", signout);

module.exports = router;
