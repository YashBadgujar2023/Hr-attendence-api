const { default: mongoose } = require('mongoose');
const employee = require('../models/employeeModel');
const catchAsync = require('../utlis/catchAsync');
const multer = require('multer');
const AppError = require('../utlis/apperror');
const fs = require('fs');
const cloudinary = require('../utlis/FileUpload');

exports.uploadEmployeePhoto = catchAsync(async (req, res, next) => {
  if (!req.file) {
    req.filePath = null;
    return next();
  }
  // Upload image to Cloudinary
  const result = await cloudinary.uploadToCloudinary(req.file.path, {
    folder: 'employee_photos',
  });

  // Update the employee record with the photo URL
  const { id } = req.params;
  const existingEmployee = await employee.findById(id);

  if (!existingEmployee) {
    return next(new AppError('Employee not found', 404));
  }

  existingEmployee.photo = result.secure_url;
  await existingEmployee.save();
  next();
});

exports.addemployee = catchAsync(async (req, res, next) => {
  const newemployee = await employee.create(req.body);
  res.status(201).json({
    status: 'success',
    message: 'Employee Created Successfully',
    data: {
      employee: newemployee,
    },
  });
});

exports.allemployee = catchAsync(async (req, res, next) => {
  const allemployee = await employee.find();
  res.status(200).json({
    status: "success",
    data: allemployee,
  });
});

exports.updateemployee = catchAsync(async (req, res, next) => {
  console.log(req.body);
  const updateemployee = await employee.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(201).json({
    status: "success",
    message: 'Employee profile updated successfully',
  });
});

exports.employeeById = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const existingEmployee = await employee.findById(id);
  if (!existingEmployee) {
    return next(new AppError("Employee not found", 404));
  }
  res.status(200).json({
    status: 'success',
    data: existingEmployee,
  });
});

exports.deleteemployee = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new AppError("Invalid ID format", 400));
  }

  const existingEmployee = await employee.findById(id);
  if (!existingEmployee) {
    return next(new AppError("Employee not found in the database", 404));
  }

  const deletedEmployee = await employee.findByIdAndDelete(id);

  res.status(200).json({
    status: 'success',
    message: 'Employee deleted successfully',
    data: deletedEmployee,
  });
});

