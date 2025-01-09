const mongoose = require('mongoose');
const validator = require('validator');
const bycrpt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    // name: {    
    //     type: String,
    //     required: [true, "Please tell your Name!"],
    // },
    phone: {
        type: Number,
        required: [true, "Please tell your Phone Number for Authentication"],
        unique: true,
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
    // email: {
    //     type: String,
    //     required: [true, 'Please Enter the Email'],
    //     unique: true,
    //     validate:{
    //         validator:validator.isEmail,
    //         message:"Please enter valid email"
    //     }
    // },
});


const User = mongoose.model("User", userSchema);
module.exports = User;