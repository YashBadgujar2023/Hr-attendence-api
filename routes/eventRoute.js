const express = require('express');
const router = express.Router();
const { model } = require("mongoose");
const { route } = require('./employeeRoute');
const eventController = require('../controller/eventController');
const newLocal = '../controller/adminController';
const auth = require(newLocal);

router.route('/').post(auth.protect,eventController.addevent).get(eventController.allevent);

router.route('/:id').delete(auth.protect,eventController.deleteEvent);

module.exports = router;