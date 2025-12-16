const mongoose = require("mongoose");

const rsvpSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
    required: true,
  },
  status: {
    type: String,
    enum: ["going", "not_going"],
    default: "going",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create a unique compound index to prevent duplicate RSVPs
rsvpSchema.index({ user: 1, event: 1 }, { unique: true });

module.exports = mongoose.model("RSVP", rsvpSchema);
