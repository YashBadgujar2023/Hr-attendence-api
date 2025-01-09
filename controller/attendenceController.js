const AppError = require('../utlis/apperror');
const catchAsync = require('../utlis/catchAsync');
const { LateRecord,Attendance } = require('../models/attendenceModel');
const MarksMissed = require('../models/marksMissed');
const { default: mongoose } = require('mongoose');
const Employee = require('../models/employeeModel'); // Assuming you have an Employee model
const { status } = require('./LeaveapplyController');
const Event = require('../models/eventModel');

exports.checkIn = catchAsync(async (req, res, next) => {
  const employeeId = req.userId;
  const checkInTime = new Date();
  const gracePeriodEnd = new Date().setHours(10, 30, 0, 0);
  const lastCheckInTime = new Date().setHours(11, 30, 0, 0); 
  
  const employeeCheck = await Employee.findById(employeeId);
  if(!employeeCheck){
    return next(new AppError('Employee not found',400));
  }
  
  const currentDate = new Date().toISOString().split('T')[0];
  const existingAttendance = await Attendance.findOne({
    employee_id: employeeId,
    check_in_time: { $gte: new Date(`${currentDate}T00:00:00.000Z`), $lte: new Date(`${currentDate}T23:59:59.999Z`) },
  });

  if (existingAttendance) {
    return next(new AppError('Already checked in!', 400));
  }
  
  let lateDuration = 0;
  let status = 'On-Time';

  if (checkInTime < gracePeriodEnd) {
    lateDuration = Math.floor((checkInTime - gracePeriodEnd) / 60000); 
    status = 'Late';

   
    await LateRecord.create({
      employee_id: employeeId,
      date: new Date().toISOString().split('T')[0],
      late_duration: lateDuration,
    });
  }

  if(checkInTime < lastCheckInTime){
    const mark = await MarksMissed.create({
      id: req.userId,
      check_in_time: checkInTime,
      status:'Missed',
      late_duration: lateDuration,
    });
    return  res.status(200).json({
      status: 'success',
      message: 'Check In requested to admin',
    });
  }

  // Create attendance record
  const attendance = await Attendance.create({ 
    employee_id: employeeId,
    check_in_time: checkInTime,
    status,
    late_duration: lateDuration,
  });

  res.status(200).json({
    status: 'success',
    message: 'Check-In Successful',
    data: attendance,
  });
});

exports.checkOut = catchAsync(async (req, res, next) => {
  const employeeId = req.userId; 
  const checkOutTime = new Date();
  const halfDayEnd = new Date().setHours(14, 0, 0, 0); 
  
  // Find today's attendance record
  const employeeCheck = await Employee.findById(employeeId);
  if(!employeeCheck){
    return next(new AppError('Employee not found',400));
  }
  const currentDate = new Date().toISOString().split('T')[0]; 
  
  const today = new Date().toISOString().split('T')[0];
  const attendance = await Attendance.findOne({
    employee_id: employeeId,
    createdAt: { $gte: today },
    check_in_time: { $exists: true },
    check_out_time: { $exists: false },
  });

  if (!attendance) {
    return next(new AppError('No active check-in found for today', 404));
  }

  // Determine early exit
  let earlyExitDuration = 0;
  if (checkOutTime < halfDayEnd) {
    earlyExitDuration = Math.floor((halfDayEnd - checkOutTime) / 60000); 
  }
  
  
  const totalMinutes = Math.floor((checkOutTime - new Date(attendance.check_in_time)) / (1000 * 60));
if (isNaN(totalMinutes)) {
  return next(new AppError('Failed to calculate total working time', 500));
}
  
  attendance.check_out_time = checkOutTime;
  attendance.total_working_hours = totalMinutes;
  await attendance.save();

  res.status(200).json({
    status: 'success',
    message: 'Check-Out Successful',
    data: attendance,
  });
});

exports.markMissedCheckIns = catchAsync(async (req, res, next) => {
  const requestid = req.params.id;
  const { status } = req.body;
  const gracePeriodEnd = new Date().setHours(10, 30, 0, 0);

  if(!status){
    return next(new AppError('Status is missing',400));
  }


  const markMissedData = await MarksMissed.findById(requestid);
  if(!markMissedData){
    return next(new AppError('Request Not Found',404));
  }


  if(status == 'rejected' || status == 'Rejected'){
    markMissedData.status = 'rejected';
    markMissedData.save();
    return  res.status(200).json({
      status:200,
      message:'Rejected Successfully'
    });
  }
  
  let statusTime = 'On-Time';
  if (markMissedData.checkInTime > gracePeriodEnd) {
    lateDuration = Math.floor((markMissedData.checkInTime - gracePeriodEnd) / 60000); 
    statusTime = 'Late';

    // Record late entry
    await LateRecord.create({
      employee_id: markMissedData.id,
      date: new Date().toISOString().split('T')[0],
      late_duration: lateDuration,
    });
  }

  console.log(`${markMissedData.check_in_time}=Employee id`);  

  const attendance = await Attendance.create({ 
    employee_id: markMissedData.id,
    check_in_time: markMissedData.check_in_time,
    status:statusTime,
    late_duration: markMissedData.late_duration,
  });

  if(attendance){
    markMissedData.status = 'Accepted';
    markMissedData.save();
  }

  res.status(200).json({
    status:200,
    message:"attendence recorded"
  });
});


exports.getMarkMissedCheckIn = catchAsync(async (req,res,next) =>{
  const getMark = await MarksMissed.find();
  console.log('Fetched Data:', getMark);
  res.status(200).json({
    status:200,
    data:getMark
  });
});


exports.getAttendanceByEmployee = catchAsync(async (req, res, next) => {
  const { employee_id } = req.params;

  const attendance = await Attendance.find({ employee_id });
  if (!attendance) {
    return next(new AppError('No attendance record found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: attendance,
  });
});

exports.getAllAttendance = catchAsync(async (req, res, next) => {
  const attendance = await Attendance.find();

  res.status(200).json({
    status: 'success',
    data: attendance,
  });
});



exports.getPayslip = catchAsync(async (req,res,next) =>{
  const { employee_id ,year ,month} = req.query;
  console.log('employee id'+employee_id);
  const employee = await Employee.findById(employee_id);
  if (!employee) {
    return next(new AppError('Employee not found',404));
  }
  const salaryData = await calculateMonthlySalaryWithHolidays(employee_id, year, month);

  if(salaryData === '1'){
    return next(new AppError('No Attendence Found',404));
  }
  res.status(200).json({
    status: 'success',
    data: salaryData,
  });
});


const calculateMonthlySalaryWithHolidays = async (employeeId, year, month) => {

  const employee = await Employee.findById(employeeId);


  let startDate = new Date(year, month - 1,1);
  let endDate = new Date(year, month,0);

  const today = new Date();
  
  const attendanceRecords = await Attendance.find({
    employee_id: employeeId,
    check_in_time: { $gte: startDate, $lte: endDate },
    check_out_time: { $ne: null }, 
  });

  if(!attendanceRecords){
    return '1';
  }


 
  const holidays = await Event.find({
    event_type: 'holiday',
  });
  const uniqueDates = new Set();
  const filteredHolidays = holidays.filter((event) => {
    const startingDate = new Date(event.starting_date);
    const endingDate = event.ending_date ? new Date(event.ending_date) : null;

    if(startingDate >= startDate && endingDate <= endingDate ){if (endingDate) {
      let currentDate = new Date(startingDate);
      while (currentDate <= endingDate) {
        const dateStr = currentDate.toISOString().split("T")[0];
        
        
        if (currentDate <= today && currentDate >= new Date(startDate) && !uniqueDates.has(dateStr)) {
          uniqueDates.add(dateStr); 
          currentDate.setDate(currentDate.getDate() + 1); 
        }
      }
      return true;
    } else {
      const dateStr = startingDate.toISOString().split("T")[0];

      if (startingDate <= today && !uniqueDates.has(dateStr)) {
        uniqueDates.add(dateStr);
        return true;
      }
      return false;
    }}
  });
  
  let totalMinutes = 0;

  let sunday = getPastAndCurrentSundays(year,month);

  attendanceRecords.forEach((record) => {
    const checkInTime = new Date(record.check_in_time);
    const checkOutTime = new Date(record.check_out_time);

    let workingMinutes = Math.floor((checkOutTime - checkInTime) / 60000);
    totalMinutes += workingMinutes;
  });

  
  const totalHours = totalMinutes / 60;

  
  const daysWorked = attendanceRecords.length;
  const totalDays = daysWorked + holidays.length;
  const salary = ((employee.salary / 8 )/60) * totalMinutes;

  const salarytotal = (sunday.length * employee.salary) + (filteredHolidays.length * employee.salary) + salary

  if(salary === null){
    salary = 0;
  }

  return {
    employeeName: employee.name,
    totalMinutesWorked: totalMinutes,
    totalDaysWorked: daysWorked,
    totalEvent:filteredHolidays.length,
    totalSunday:sunday.length,
    totalHolidays: (holidays.length + sunday.length),
    salary:salarytotal,
  };
};

function getPastAndCurrentSundays(year, month) {
  const sundays = [];
  const currentDate = new Date(); 
  const date = new Date(year, month - 1, 1); 
  while (date.getMonth() === month - 1) {
    
    if (date.getDay() === 0) {
     
      if (date <= currentDate) {
        sundays.push(new Date(date)); 
      }
    }
    
    date.setDate(date.getDate() + 1);
  }

  return sundays;
}
