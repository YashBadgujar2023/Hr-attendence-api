const mongoose = require('mongoose');
const validator = require('validator');


const LeaveSchema = mongoose.Schema({
    employee_id:{
        type:String,
    },
    employee_name:{
        type:String
    },
    leave_type:{
        type:String,
        required:[true,"Please tell leave type"]
    },
    starting_date:{
        type:Date,
        required:[true,"Please tell starting date"]
    },
    ending_date:{
        type:Date
    },
    reason:{
        type:String,
        required:[true,"Please tell reason for leave"]
    },
    date:{
        type:Date,
        default:new Date()
    },
    status: { 
        type: String, 
        enum: ['Pending', 'Accepted', 'Rejected'], 
        default: 'Pending' 
      }, 
    adminResponse:{
        adminId: { type: String },
        adminName: { type: String },
        comment: { type: String },
        actionDate: { type: Date ,
        },
    }

},{Timestamp:true});


const leaveapply = mongoose.model("leaveApply",LeaveSchema);
module.exports = leaveapply;