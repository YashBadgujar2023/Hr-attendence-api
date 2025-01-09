const mongoose = require('mongoose');
const validator = require('validator');

const eventSchema = new mongoose.Schema({
    heading:{
        type:String,
        required:[true,"Please tell heading"]
    },
    event_type:{
        type:String,
        required:[true,"Please tell event type"]
    },
    starting_date:{
        type:Date,
        required:[true,"Please tell starting date"]
    },
    ending_date:{
        type:Date,
        default:""
    },
    description:{
        type:String,
        required:[true,"Please tell description"]
    }
});



const event = mongoose.model('event',eventSchema);
module.exports = event;