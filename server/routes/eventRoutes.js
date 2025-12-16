const express = require('express');
const router = express.Router();
const {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  getMyEvents,
  getAttendingEvents
} = require('../controllers/eventController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/fileUploadsMiddleware');

// Public routes
router.get('/', getEvents);
router.get('/:id', getEventById);

// Protected routes
router.use(protect);
router.post('/', upload.single('image'), createEvent);
router.put('/:id', upload.single('image'), updateEvent);
router.delete('/:id', deleteEvent);
router.get('/my/events', getMyEvents);
router.get('/my/attending', getAttendingEvents);

module.exports = router;