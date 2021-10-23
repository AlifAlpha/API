const express = require("express");
const {
  createDgApp,
  getDgApp,
  getDgAppById,
  getOneDgApp,
} = require("../controllers/dgApp");

const router = express.Router();
router.post("/dgapp", createDgApp);
router.get("/dgapp", getDgApp);
router.get("/dgapp/:dgAppId", getOneDgApp);
// router.put("/dgapp/:dgAppId", updateItreqform);
// router.delete("/dgapp/:dgAppId", deleteItreqform);

router.param("dgAppId", getDgAppById);

module.exports = router;
