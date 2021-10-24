const express = require("express");
const {
  createRoom,
  getRoom,
  getOneRoom,
  roomById,
  updateRoom,
  deleteRoom,
} = require("../controllers/rooms");

const router = express.Router();
router.post("/room", createRoom);
router.get("/room", getRoom);
router.get("/room/:roomId", getOneRoom);
router.put("/room/:roomId", updateRoom);
router.delete("/room/:roomId", deleteRoom);

router.param("roomId", roomById);

module.exports = router;
