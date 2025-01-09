const { default: mongoose } = require('mongoose');
const eventModel = require('../models/eventModel');
const catchAsync = require('../utlis/catchAsync');
const AppError = require('../utlis/apperror');
const admin = require('../models/adminModel');


exports.addevent = catchAsync(
    async (req,res,next) =>{
        const user = admin.findById(req.userId);
        if(!user){
            return new AppError("Admin not Found",401);
        }
        const newEvent = await eventModel.create(req.body);
        res.status(201).json({
            status:'success',
            message:'Event Create Successfully',
            event:newEvent
        });
    }
);

exports.allevent = catchAsync(async (req, res, next) => {
    const newEvent = await eventModel.find();
  
    if (!newEvent || newEvent.length === 0) {
      return res.status(200).json({
        status: "success",
        message: "No events found",
        data: {
          past_event: [],
          upcoming_event: [],
        },
      });
    }
  
    const currentDate = new Date();
    const pastEvents = [];
    const upcomingEvents = [];
  
    newEvent.forEach((event) => {
      const { starting_date, ending_date } = event;
  
      const startDate = new Date(starting_date);
      const endDate = ending_date ? new Date(ending_date) : null;
  
      if (
        (endDate && currentDate > endDate) || // If the event has ended
        (!endDate && currentDate > startDate) // If no ending date, compare with the start date
      ) {
        pastEvents.push(event);
      } else {
        upcomingEvents.push(event);
      }
    });
  
    // Sort past events by the most recent past dates (descending order)
    pastEvents.sort((a, b) => {
      const aDate = new Date(a.ending_date || a.starting_date);
      const bDate = new Date(b.ending_date || b.starting_date);
      return bDate - aDate; // Descending order
    });
  
    // Sort upcoming events by the closest upcoming dates (ascending order)
    upcomingEvents.sort((a, b) => {
      const aDate = new Date(a.starting_date);
      const bDate = new Date(b.starting_date);
      return aDate - bDate; // Ascending order
    });
  
    res.status(200).json({
      status: "success",
      message: "Events fetched successfully",
      data: {
        past_event: pastEvents,
        upcoming_event: upcomingEvents,
      },
    });
  });
  
exports.deleteEvent = catchAsync(
    async (req,res,next) =>{
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return next(new AppError("Invalid ID format", 400));
        }
        // Check if the Employee exists in the database
        const existingevent = await eventModel.findById(id);
        if (!existingevent) {
            return next(new AppError("Event not found in the database", 404));
        }
    
        const deleteEvent = await eventModel.findByIdAndDelete(req.params.id);
        res.status(200).json({
            status:'success',
            message:'Event deleted Successfully',
            event:deleteEvent
        });
    }
);