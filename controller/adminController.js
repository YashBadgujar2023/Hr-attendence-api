const admin = require('../models/adminModel');
const AppError = require('../utlis/apperror');
const catchAsync = require('../utlis/catchAsync');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const signToken = (id) =>{
    return jwt.sign({id:id},process.env.JWT_SECRET,{
        
    });
}
exports.createAdmin = catchAsync(
    async (req,res,next) =>{
        const newAdmin = await admin.create(req.body);
        console.log(newAdmin);
        console.log(newAdmin._id);
        const token = signToken(newAdmin._id);
        res.status(200).json({
            status:"sucess",
            token:token,
            data:{
                user:newAdmin
            }
        })
    }
);

exports.login = catchAsync(async(req,res,next)=>{
    const { email,password} = req.body;
    if(!email||!password){
        return next(new AppError("Please provide email and password"));
    }
    const user = await admin.findOne({email}).select('+password');
    console.log(user);
    const correct = await bcrypt.compare(password, user.password);
    if (!user || !correct) {
        return next(new AppError("Incorrect Password and Email", 401));
      }
      const token = signToken(user._id);
      res.status(200).json({
        status: "Success",
        token,
      });
});

exports.protect = catchAsync(async (req,res,next) =>{
    const authHeader = req.headers.authorization;
    console.log("auth is call protect");
    console.log(authHeader);
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return next(new AppError("Authorization token missing or invalid.",401));
      }
      const token = authHeader.split(" ")[1];

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id;
        next();
      } catch (err) {
        return next(new AppError("Invalid or expired token.",401));
      }
});