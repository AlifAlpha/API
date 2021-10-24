const express = require("express");
const {
  createDgApp,
  getDgApp,
  getDgAppById,
  getOneDgApp,
  updateDgApp,
  deleteDgApp,
} = require("../controllers/dgApp");

const router = express.Router();
router.post("/dgapp", createDgApp);
router.get("/dgapp", getDgApp);
router.get("/dgapp/:dgAppId", getOneDgApp);
router.put("/dgapp/:dgAppId", updateDgApp);
router.delete("/dgapp/:dgAppId", deleteDgApp);

router.param("dgAppId", getDgAppById);

module.exports = router;
