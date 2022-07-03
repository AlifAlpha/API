const express = require("express");
const {
  createEvent,
  getEvents,
  getEventById,
  getOneEvent,
  updateEvent,
  deleteEvent,
} = require("../controllers/events");

const router = express.Router();
router.post("/events", createEvent);
router.get("/events", getEvents);
router.get("/events/:eventsId", getOneEvent);
router.put("/events/:eventsId", updateEvent);
router.delete("/events/:eventsId", deleteEvent);

router.param("eventsId", getEventById);
module.exports = router;
