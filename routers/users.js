const express = require("express");
const {
  signin,
  createUsers,
  signout,
  getUsers,
  getUserOne,
  getUserById,
  updateUser,
  deleteUser,
} = require("../controllers/users");

const router = express.Router();

router.post("/user", createUsers);
router.get("/user", getUsers);
router.get("/user/:userId", getUserById);
router.put("/user/:userId", updateUser);
router.delete("/user/:userId", deleteUser);

// router.post("/user", signin);
// router.get("/user", signout);

router.param("userId", getUserOne);

module.exports = router;
