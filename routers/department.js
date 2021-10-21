const express = require("express");
const {
  createDepartment,
  getDepartment,
  getOneDepartment,
  getDepartmentById,
  updateDepartment,
  deleteDepartment,
} = require("../controllers/department");

const router = express.Router();
router.post("/department", createDepartment);
router.get("/department", getDepartment);
router.get("/department/:departmentId", getOneDepartment);
router.put("/department/:departmentId", updateDepartment);
router.delete("/department/:departmentId", deleteDepartment);

router.param("departmentId", getDepartmentById);

module.exports = router;
