const express = require("express");
const {
  createEmployee,
  getEmployees,
  getOneEmployee,
  employeeById,
  updateEmployee,
  deleteEmployee,
} = require("../controllers/employees");

const router = express.Router();
router.post("/employee", createEmployee);
router.get("/employee", getEmployees);
router.get("/employee/:employeeById", getOneEmployee);
router.put("/employee/:employeeById", updateEmployee);
router.delete("/employee/:employeeById", deleteEmployee);

router.param("employeeById", employeeById);

module.exports = router;
