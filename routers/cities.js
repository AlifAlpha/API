const express = require("express");
const {
  createCity,
  getCities,
  cityById,
  updateCity,
  deleteCity,
} = require("../controllers/cities");

const router = express.Router();
router.post("/cities", createCity);
router.get("/cities", getCities);
router.get("/cities/:cityId", cityById);
router.put("/cities/:cityId", updateCity);
router.delete("/cities/:cityId", deleteCity);

router.param("cityId", cityById);
module.exports = router;
