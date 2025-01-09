const express = require('express');
const attendanceController = require('../controller/attendenceController'); // Adjust path
const router = express.Router();
const newLocal = '../controller/adminController';
const auth = require(newLocal);

// Check-in endpoint
router.post('/check-in',auth.protect, attendanceController.checkIn);

router.post('/check-out',auth.protect, attendanceController.checkOut);

router.get('/mark-missed/all_data',attendanceController.getMarkMissedCheckIn).post('/mark-missed/:id', attendanceController.markMissedCheckIns);
router.get('/payslip',attendanceController.getPayslip);

router.get('/:employee_id',attendanceController.getAttendanceByEmployee);

// Get all attendance records
router.get('/',attendanceController.getAllAttendance);


module.exports = router;