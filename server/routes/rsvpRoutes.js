const express = require('express');
const router = express.Router();
const {
  createRSVP,
  cancelRSVP,
  getRSVPStatus
} = require('../controllers/rsvpController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);
router.post('/:eventId', createRSVP);
router.delete('/:eventId', cancelRSVP);
router.get('/:eventId/status', getRSVPStatus);

module.exports = router;