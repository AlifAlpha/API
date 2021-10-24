const express = require("express");
const {
  createRoom,
  getRoom,
  getOneRoom,
  roomById,
} = require("../controllers/rooms");

const router = express.Router();
router.post("/room", createRoom);
router.get("/room", getRoom);
router.get("/room/:roomId", getOneRoom);
// router.put("/room/:roomId", updateLeaveType);
// router.delete("/room/:roomId", deleteLeaveType);

router.param("roomId", roomById);

module.exports = router;
