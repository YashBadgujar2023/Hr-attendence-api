const express = require("express");
const newLocal = '../controller/adminController';
const admin = require(newLocal);
const { model } = require("mongoose");
const { route } = require("./employeeRoute");
const router = express.Router();
const leaveApply = require('../controller/LeaveapplyController');

router.post('/signup',admin.createAdmin);
router.post('/login',admin.login);
router.put('/leaveapply',admin.protect,leaveApply.status).get('/leaveapply',admin.protect,leaveApply.AllleaveApplication);

module.exports = router;