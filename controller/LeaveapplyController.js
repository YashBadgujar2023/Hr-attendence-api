const catchAsync = require('../utlis/catchAsync');
const AppError = require('../utlis/apperror');
const employee = require('../models/employeeModel');
const leaveApply = require('../models/LeaveapplyModel');
const { default: mongoose } = require('mongoose');
const admin = require('../models/adminModel');


exports.leaveApply = catchAsync(
    async(req,res,next) =>{
        const {leave_type, starting_date, ending_date, reason} = req.body;
        const user = await employee.findById(req.userId);
        if(!user){
            return next(new AppError("User not found",401));
        } 
        const leave = await leaveApply.create({
            employee_id: user._id,
            employee_name:user.name,
            leave_type,
            starting_date,
            ending_date,
            reason,
        });
        res.status(200).json({
            status:"Success",
            message:"Leave Apply Successfully",
            data:leave
        });
    }
);

exports.status = catchAsync(
    async(req,res,next) =>{
        const {leave_id,status,comment} = req.body;
        if(leave_id == null || status==null || comment ==null){
            if(leave_id == null && status==null && comment ==null){
                return next(new AppError("Leave id,Status,Comment all there field required",400));
            }
            else {if (!comment) {
                return next(new AppError("Comment required",400));
            } else if (!status) {
                return next(new AppError("Status required",400));
            } else if (!leave_id) {
                return next(new AppError("Leave required",400));
            }}
        }
        const user = await admin.findById(req.userId);
        if(!user){
            return next(new AppError("Admin not found",404));
        }
        const leave = await leaveApply.findByIdAndUpdate(
            leave_id,
            {
                status:status,
                'adminResponse.adminId': user._id,
      'adminResponse.adminName': user.name,
      'adminResponse.comment': comment,
      'adminResponse.actionDate': new Date(),
            }
        );
        if (!leave) {
            return next(new AppError('Leave application not found', 404));
        }
        res.status(200).json({
            status:"success",
            message:"Status update successfully",
        });
    }
);

exports.AllleaveApplication = catchAsync(
    async(req,res,next)=>{
        const user = await admin.findById(req.userId);
        if(!user){
            return next(new AppError("Admin not found"));
        }
        const allleave = await leaveApply.find();
        const pending = [];
    const accepted = [];
    const rejected = [];
        allleave.forEach(group => {
            if(group.status === "Pending"){
                pending.push(group);
            }
            else if(group.status === "Accepted"){
                accepted.push(group);
            }
            else if(group.status === "Rejected"){
                rejected.push(group);
            }
        });
        res.status(200).json({
            status:"Success",
            data: {
                Pending: pending,
                Accepted: accepted,
                Rejected: rejected,
              },
        })
    }
)