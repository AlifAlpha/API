const express = require("express");
const {
  createItreqform,
  getItreqform,
  getOneItreqform,
  updateItreqform,
  deleteItreqform,
  getItreqformById,
} = require("../controllers/itreqform");

const router = express.Router();
router.post("/itreqform", createItreqform);
router.get("/itreqform", getItreqform);
router.get("/itreqform/:itreqformId", getOneItreqform);
router.put("/itreqform/:itreqformId", updateItreqform);
router.delete("/itreqform/:itreqformId", deleteItreqform);

router.param("itreqformId", getItreqformById);

module.exports = router;
