const express = require("express");const {
  getActivityById,
  createActivity,
  getActivities,
  getOneActivity,
  updateAcivity,
  deleteAcivity,
} = require("../controllers/acitivity");
const router = express.Router();
router.post("/activity", createActivity);
router.get("/activity", getActivities);
router.get("/activity/:ActivityId", getOneActivity);
router.put("/activity/:ActivityId", updateAcivity);
router.delete("/activity/:ActivityId", deleteAcivity);

router.param("ActivityId", getActivityById);

module.exports = router;
