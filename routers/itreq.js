const express = require("express");const {
  createItreq,
  getItreq,
  getOneItreq,
  getItreqById,
  updateItreq,
  deleteItreq,
} = require("../controllers/itreq");

const router = express.Router();

router.post("/itreq", createItreq);
router.get("/itreq", getItreq);
router.get("/itreq/:itreqId", getOneItreq);
router.put("/itreq/:itreqId", updateItreq);
router.delete("/itreq/:itreqId", deleteItreq);

router.param("itreqId", getItreqById);

module.exports = router;
