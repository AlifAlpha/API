const express = require("express");
const { signin, signout } = require("../controllers/auth");

const router = express.Router();

router.post("/auth", signin);

router.get("/auth", signout);

module.exports = router;
