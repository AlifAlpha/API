const express = require("express");const {
    createLtips,
    getLtips,
    getOneLtips,
    updateLtips,
    deleteLtips,
    getLtipsById,
  } = require("../controllers/ltips");
  
  const router = express.Router();
  router.post("/ltips", createLtips);
  router.get("/ltips", getLtips);
  router.get("/ltips/:ltipsId", getOneLtips);
  router.put("/ltips/:ltipsId", updateLtips);
  router.delete("/ltips/:ltipsId", deleteLtips);
  
  router.param("ltipsId", getLtipsById);
  
  module.exports = router;