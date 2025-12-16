const Event = require('../models/Event');
const RSVP = require('../models/RSVP');
const cloudinary = require('../config/cloudinary');
const fs = require('fs');

// @desc    Create a new event
// @route   POST /api/events
// @access  Private
const createEvent = async (req, res) => {
  try {
    const { title, description, dateTime, location, capacity } = req.body;

    // Handle image upload
    let imageUrl = '';
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'event-platform'
      });
      imageUrl = result.secure_url;
      // Delete file from uploads folder after upload
      fs.unlinkSync(req.file.path);
    }

    const event = await Event.create({
      title,
      description,
      dateTime,
      location,
      capacity,
      image: imageUrl,
      organizer: req.user.id
    });

    res.status(201).json(event);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all events
// @route   GET /api/events
// @access  Public
const getEvents = async (req, res) => {
  try {
    const events = await Event.find()
      .populate('organizer', 'name email')
      .sort({ dateTime: 1 });
    res.json(events);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get single event
// @route   GET /api/events/:id
// @access  Public
const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('organizer', 'name email')
      .populate('attendees', 'name email');

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json(event);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private
const updateEvent = async (req, res) => {
  try {
    let event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if user is the organizer
    if (event.organizer.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    // Handle image upload if new image is provided
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'event-platform'
      });
      req.body.image = result.secure_url;
      fs.unlinkSync(req.file.path);
    }

    event = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(event);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if user is the organizer
    if (event.organizer.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await event.deleteOne();
    await RSVP.deleteMany({ event: req.params.id });

    res.json({ message: 'Event removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get user's events
// @route   GET /api/events/my-events
// @access  Private
const getMyEvents = async (req, res) => {
  try {
    const events = await Event.find({ organizer: req.user.id })
      .populate('organizer', 'name email')
      .sort({ createdAt: -1 });
    res.json(events);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get events user is attending
// @route   GET /api/events/attending
// @access  Private
const getAttendingEvents = async (req, res) => {
  try {
    const rsvps = await RSVP.find({ user: req.user.id, status: 'going' })
      .populate({
        path: 'event',
        populate: { path: 'organizer', select: 'name email' }
      });

    const events = rsvps.map(rsvp => rsvp.event);
    res.json(events);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  getMyEvents,
  getAttendingEvents
};