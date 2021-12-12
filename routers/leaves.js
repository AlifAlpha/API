const express = require("express");
const {
  createLeave,
  getLeaves,
  getOneLeave,
  updateLeave,
  getLeaveById,
  deleteLeave,
} = require("../controllers/leaves");

const router = express.Router();
router.post("/leaves", createLeave);
router.get("/leaves", getLeaves);
router.get("/leaves/:leavesId", getOneLeave);
router.put("/leaves/:leavesId", updateLeave);
router.delete("/leaves/:leavesId", deleteLeave);

router.param("leavesId", getLeaveById);

module.exports = router;
