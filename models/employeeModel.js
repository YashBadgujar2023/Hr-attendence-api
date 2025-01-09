const mongoose = require('mongoose');
const validator = require('validator');

const  employeeSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please tell Name!"]
    },
    photo:String,
    position:{
        type:String,
        required:[true,"Please tell position"]
    },
    reporting_manager:{
        type:String,
        required:[true,"Please tell reporting manager"]
    },
    office_email:{
        type:String,
        required:[true,"Please tell office email"],
        validate:{
            validator:validator.isEmail,
            message:"Please enter valid office email"
        }
    },
    joined_on:{
        type:Date,
        required:[true,"Please tell Joined on"]
    },
    office_phone:{
        type:Number,
        required:[true,"Please tell office phone"],
        validate: {
            validator: function (value) {
                const phoneStr = value.toString();
                return (
                    phoneStr.length === 10 && // Check if it's 10 digits
                    /^[6-9]\d{9}$/.test(phoneStr) // Ensure it starts with 6-9 and has 10 digits
                );
            },
            message: "Please enter a valid phone number"
        }
    },
    personal_email:{
        type:String,
        required:[true,"Please tell personal email"],
        unique: true,
        validate:{
            validator:validator.isEmail,
            message:"Please enter valid personal email"
        }
    },
    personal_phone:{
        type:Number,
        required:[true,"Please tell personal phone"],
        unique: true,
        validate: {
            validator: function (value) {
                const phoneStr = value.toString();
                return (
                    phoneStr.length === 10 && // Check if it's 10 digits
                    /^[6-9]\d{9}$/.test(phoneStr) // Ensure it starts with 6-9 and has 10 digits
                );
            },
            message: "Please enter a valid personal phone number"
        }
    },
    bank_holder_name:{
        type:String,
        required:[true,"Please tell bank holder name"]
    },
    bank_account_number:{
        type:Number,
        required:[true,"Please tell account number"]
    },
    bank_name:{
        type:String,
        required:[true,"Please tell bank name"]
    },
    bank_ifsc:{
        type:String,
        required:[true,"Please tell bank ifsc"]
    },
    salary:{
        type:String,
        required:[true,'Please tell salary']
    }
});


const employee = mongoose.model('Employee',employeeSchema);
module.exports = employee;