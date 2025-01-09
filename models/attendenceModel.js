const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  employee_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true,
  },
  check_in_time: {
    type: Date,
  },
  check_out_time: {
    type: Date,
  },
  total_working_hours: {
    type: Number, // Hours worked (calculated)
    default: 0,
  },
  late_duration: {
    type: Number, // Minutes late after 10:30 AM
    default: 0,
  },
  status: {
    type: String,
    enum: ['On-Time', 'Late', 'Half-Day', 'Missed','Rejected'],
    default: 'Missed',
  },
}, { timestamps: true },{ collection: 'attendance' });


const lateSchema = new mongoose.Schema({
    employee_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    late_duration: {
      type: Number, // Minutes late
      required: true,
    },
  });


  
const LateRecord = mongoose.model('LateRecord', lateSchema);
  
const Attendance =  mongoose.model('Attendance', attendanceSchema);




module.exports = { LateRecord, Attendance };