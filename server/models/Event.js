const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please add a title"],
    trim: true,
    maxlength: [100, "Title cannot be more than 100 characters"],
  },
  description: {
    type: String,
    required: [true, "Please add a description"],
    maxlength: [500, "Description cannot be more than 500 characters"],
  },
  dateTime: {
    type: Date,
    required: [true, "Please add date and time"],
  },
  location: {
    type: String,
    required: [true, "Please add a location"],
    maxlength: [200, "Location cannot be more than 200 characters"],
  },
  capacity: {
    type: Number,
    required: [true, "Please add capacity"],
    min: [1, "Capacity must be at least 1"],
  },
  image: {
    type: String,
    default: "",
  },
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  attendees: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Event", eventSchema);
