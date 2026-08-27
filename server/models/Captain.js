const mongoose=require('mongoose');
const {Schema} = require("mongoose");
const validator=require('validator');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');

const captainSchema= mongoose.Schema({

    firstName:{
        type:String,
        required:true,
        minLength:3,
    },
    lastName:{
        type:String,
        minLength:3,

    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        validate: {
            validator: validator.isEmail,
            message: "Invalid Email address"
        }
    },
    password:{
        type:String,
        required:true,
        minLength:6,
        select:false,
        validate:{
            validator: validator.isStrongPassword,
            message: "Invalid Password"

        }

    },
    socketId:{
        type:String,
    },
    status:{
        type:String,
        default:"inactive",
        enum:["active","inactive"],
    },
    vehicle:{
        color:{
            type:String,
            required:true,
            minLength:3,
        },
        vehicleType:{
            type:String,
            required:true,
            enum:["car","motorcycle","auto","luxury car"],
        },
        plateNumber:{
            type:String,
            required:true,
            minLength:3,
        },
        capacity:{
            type:Number,
            required:true,
            min:1,
        },

    },
    location:{
        latitude:{
            type:Number,

        },
        longitude:{
            type:Number,

        }
    }





},{timestamps:true});

captainSchema.statics.hashPassword=async function(password){
    return await bcrypt.hash(password,10);

}
captainSchema.methods.matchPassword=async function(enteredPassword){

    return await bcrypt.compare(enteredPassword,this.password);

}

captainSchema.methods.getSignedJwtToken=function(){

    return jwt.sign(
        { id: this._id },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
    );

}

const Captain=mongoose.model("Captain", captainSchema);
module.exports=Captain;