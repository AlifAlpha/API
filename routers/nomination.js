const express = require("express");
const {
  createNomination,
  getNomination,
  getOneNomination,
  updateNomination,
  deleteNomination,
  getNominationById,
} = require("../controllers/nomination");

const router = express.Router();
router.post("/nomination", createNomination);
router.get("/nomination", getNomination);
router.get("/nomination/:nominationId", getOneNomination);
router.put("/nomination/:nominationId", updateNomination);
router.delete("/nomination/:nominationId", deleteNomination);

router.param("nominationId", getNominationById);

module.exports = router;
