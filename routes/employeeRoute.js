const express = require('express');
const router = express.Router();
const { model } = require("mongoose");
const employeeController = require('../controller/employeeController');
const newLocal = '../controller/adminController';
const auth = require(newLocal);
const leaveApply = require('../controller/LeaveapplyController');
const authController = require('../controller/authController');const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null,'./uploads');  },
  filename: (req, file, cb) => {
    cb(null, req.params.id + '-' + file.originalname);
  },
});
const upload = multer({ storage: storage });

router.post('/login',authController.login);

router.route('/').post(employeeController.addemployee).get(employeeController.allemployee);

router.route('/:id').get(employeeController.employeeById).patch(upload.single('photo'),employeeController.uploadEmployeePhoto,employeeController.updateemployee).delete(employeeController.deleteemployee);

router.route('/leaveapply').post(auth.protect,leaveApply.leaveApply);


module.exports = router;