const markMissedCheckIns = async () => {
    const today = new Date().toISOString().split('T')[0];
    const employees = await Employee.find();
  
    employees.forEach(async (employee) => {
      const attendance = await Attendance.findOne({
        employee_id: employee._id,
        createdAt: { $gte: today },
      });
  
      if (!attendance) {
        await Attendance.create({
          employee_id: employee._id,
          status: 'Missed',
        });
      }
    });
  
    console.log('Missed check-ins marked');
  };

  module.exports = markMissedCheckIns;