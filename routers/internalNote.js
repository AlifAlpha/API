const express = require("express");
const { createIntnote, getIntnote, getOneIntnote, updateIntnote, deleteIntnote, getIntnoteById } = require("../controllers/internalNote");


const router = express.Router();
router.post("/notedg", createIntnote);
router.get("/notedg", getIntnote);
router.get("/notedg/:intnotesId", getOneIntnote);
router.put("/notedg/:intnotesId", updateIntnote);
router.delete("/notedg/:intnotesId", deleteIntnote);

router.param("intnotesId", getIntnoteById);

module.exports = router;
