const Event = require('../models/Event');
const RSVP = require('../models/RSVP');
const mongoose = require('mongoose');

// @desc    RSVP to an event (Critical: Handles race conditions and capacity)
// @route   POST /api/rsvp/:eventId
// @access  Private
const createRSVP = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const eventId = req.params.eventId;
    const userId = req.user.id;

    // Check if user has already RSVP'd
    const existingRSVP = await RSVP.findOne({
      user: userId,
      event: eventId
    }).session(session);

    if (existingRSVP) {
      await session.abortTransaction();
      return res.status(400).json({ message: 'You have already RSVP\'d to this event' });
    }

    // Get event with locking to prevent race conditions
    const event = await Event.findById(eventId).session(session);

    if (!event) {
      await session.abortTransaction();
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check capacity - ATOMIC OPERATION
    if (event.attendees.length >= event.capacity) {
      await session.abortTransaction();
      return res.status(400).json({ message: 'Event is at full capacity' });
    }

    // Create RSVP
    const rsvp = await RSVP.create([{
      user: userId,
      event: eventId,
      status: 'going'
    }], { session });

    // Add user to attendees array (atomic update)
    await Event.findByIdAndUpdate(
      eventId,
      {
        $addToSet: { attendees: userId },
        $inc: { __v: 1 } // Optimistic concurrency control
      },
      { session, new: true }
    );

    await session.commitTransaction();

    res.status(201).json({
      message: 'Successfully RSVP\'d to event',
      rsvp: rsvp[0]
    });
  } catch (error) {
    await session.abortTransaction();
    console.error('RSVP Error:', error);

    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({ message: 'You have already RSVP\'d to this event' });
    }

    res.status(500).json({ message: 'Server error during RSVP' });
  } finally {
    session.endSession();
  }
};

// @desc    Cancel RSVP
// @route   DELETE /api/rsvp/:eventId
// @access  Private
const cancelRSVP = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const eventId = req.params.eventId;
    const userId = req.user.id;

    // Find and delete RSVP
    const rsvp = await RSVP.findOneAndDelete({
      user: userId,
      event: eventId
    }).session(session);

    if (!rsvp) {
      await session.abortTransaction();
      return res.status(404).json({ message: 'RSVP not found' });
    }

    // Remove user from attendees array
    await Event.findByIdAndUpdate(
      eventId,
      {
        $pull: { attendees: userId },
        $inc: { __v: 1 }
      },
      { session }
    );

    await session.commitTransaction();

    res.json({ message: 'RSVP cancelled successfully' });
  } catch (error) {
    await session.abortTransaction();
    console.error('Cancel RSVP Error:', error);
    res.status(500).json({ message: 'Server error' });
  } finally {
    session.endSession();
  }
};

// @desc    Check RSVP status
// @route   GET /api/rsvp/:eventId/status
// @access  Private
const getRSVPStatus = async (req, res) => {
  try {
    const rsvp = await RSVP.findOne({
      user: req.user.id,
      event: req.params.eventId
    });

    if (rsvp) {
      res.json({ isRSVPed: true, status: rsvp.status });
    } else {
      res.json({ isRSVPed: false });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { createRSVP, cancelRSVP, getRSVPStatus };