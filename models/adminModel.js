const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require("bcryptjs");


const adminSchema = mongoose.Schema({
    email:{
        type:String,
        required:[true,"Please tell email"],
        unique: true,
        validate:{
            validator:validator.isEmail,
            message:"Please enter email"
        }
    },
    name:{
        type:String,
        required:[true,"Please tell name"]
    },
    password:{
        type:String,
        required:[true,"Password not enter"]
    }
});

adminSchema.pre('save',async function(next){
    if(!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password,12);
    next();
});

adminSchema.methods.comparePassword = async function (
    candidatePassword,
    userPassword
  ) {
    return await bcrypt.compare(candidatePassword, userPassword);
  };

const admin = mongoose.model('admin',adminSchema);
module.exports = admin;