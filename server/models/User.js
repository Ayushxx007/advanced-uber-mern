const mongoose = require('mongoose');
const validator=require('validator');
const isEmail = require("validator/es/lib/isEmail");
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');

const userSchema=mongoose.Schema(
    {

        firstName:{
            type:String,
            required:true,
            minLength:3,
        },
        lastName:{
            type:String,
            minLength:3,
        }
        ,
        email:{
            type:String,
            required:true,
            unique:true,
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
                validator:validator.isStrongPassword,
                message:"Password must be strong"

            }
        },
        socketId:{
            type:String,
        }


    }


,{timestamps:true});

userSchema.methods.getSignedJwtToken=function(){
    return jwt.sign({id:this._id},process.env.JWT_SECRET,{expiresIn:process.env.JWT_SECRET});

}

userSchema.methods.matchPassword=async function(enteredPassword){

    return await bcrypt.compare(enteredPassword,this.password);
}

userSchema.static.hashPassword=async function(password){

    return await bcrypt.hash(password,10);
}


const User=mongoose.model('User',userSchema);
module.exports=User;

