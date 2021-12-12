const express = require("express");
const {
  createTravelinfo,
  getTravelinfo,
  travelinfoById,
  getOneTravelinfo,
  // updateTravelinfo,
  // deleteTravelinfo,
} = require("../controllers/travelinfo");

const router = express.Router();
router.post("/travelinfo", createTravelinfo);
router.get("/travelinfo", getTravelinfo);
router.get("/travelinfo/:travelinfoId", getOneTravelinfo);
// router.put("/travelinfo/:travelinfoId", updateTravelinfo);
// router.delete("/travelinfo/:travelinfoId", deleteTravelinfo);

router.param("travelinfoId", travelinfoById);

module.exports = router;
