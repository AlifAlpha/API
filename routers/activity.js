const express = require("express");const {
  getActivityById,
  createActivity,
  getActivities,
  getOneActivity,
  updateAcivity,
  deleteAcivity,
} = require("../controllers/acitivity");
const router = express.Router();
router.post("/activities", createActivity);
router.get("/activities", getActivities);
router.get("/activities/:ActivityId", getOneActivity);
router.put("/activities/:ActivityId", updateAcivity);
router.delete("/activities/:ActivityId", deleteAcivity);

router.param("ActivityId", getActivityById);

module.exports = router;
