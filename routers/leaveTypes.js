const express = require("express");
const {
  createLeaveType,
  getLeavesType,
  leaveTypeById,
  updateLeaveType,
  deleteLeaveType,
  getOneLeaveType,
} = require("../controllers/leaveTypes");

const router = express.Router();
router.post("/leavetype", createLeaveType);
router.get("/leavetype", getLeavesType);
router.get("/leavetype/:leaveTypeId", getOneLeaveType);
router.put("/leavetype/:leaveTypeId", updateLeaveType);
router.delete("/leavetype/:leaveTypeId", deleteLeaveType);

router.param("leaveTypeId", leaveTypeById);

module.exports = router;
