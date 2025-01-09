const mongoose = require('mongoose');

const markMissedSchema = new mongoose.Schema({
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
    },
    check_in_time: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['Missed','Rejected','Accpeted'],
      default: 'Missed',
    },
    late_duration: {
      type: Number, // Minutes late after 10:30 AM
      default: 0,
    },
  },{
    timestamps: true,
    collection: 'marks_missed',
  });

  const MarksMissed = mongoose.model('MarksMissed', markMissedSchema);
  module.exports = MarksMissed;