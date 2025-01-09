const User = require('../models/userModel');
const catchAsync = require('../utlis/catchAsync');
const employee = require('../models/employeeModel');
const AppError = require('../utlis/apperror');
const jwt = require("jsonwebtoken");

const signToken = (id) =>{
    return jwt.sign({id:id},process.env.JWT_SECRET,{
        
    });
}

exports.login = catchAsync(async (req,res,next)=>{
    const { phone } = req.body;
    console.log(phone);
    const user = await employee.findOne({personal_phone:phone});
    if(!user){
        return next(new AppError("User not found",401));
    }
    const token = signToken(user._id);
    res.status(201).json({
        status:'success',
        token:token,
        Otp:Math.floor(100000 + Math.random() * 900000)
    });
});