const express = require("express");
const {
  createParticipation,
  getParticipation,
  getOneParticipation,
  updateParticipation,
  deleteParticipation,
  getParticipationById,
} = require("../controllers/participation");

const router = express.Router();
router.post("/participation", createParticipation);
router.get("/participation", getParticipation);
router.get("/participation/:participationId", getOneParticipation);
router.put("/participation/:participationId", updateParticipation);
router.delete("/participation/:participationId", deleteParticipation);

router.param("participationId", getParticipationById);

module.exports = router;
