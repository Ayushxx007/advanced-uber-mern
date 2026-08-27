const Captain = require('../models/Captain.js');
const validator = require('validator');
const blackListToken = require("../models/blackListToken");



const login = async(req, res) => {

    try{
        const {email,password}=req.body;

        const captain=await Captain.findOne({email}).select('+password');

        if(!captain){
            return res.status(400).json({message:"Invalid credentials"});
        }
        const isMatch=await captain.matchPassword(password);

        if(!isMatch){
            return res.status(400).json({message:"Invalid credentials"});
        }

        const token=captain.getSignedJwtToken();

        res.cookie('token', token, {
            httpOnly: true,
            sameSite: 'lax',
            secure: process.env.NODE_ENV !== 'development',
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
        });


        res.status(201).json({message: "Captain Logged In successfully"});

    }catch(err){

        console.log(err);
        res.status(500).json({ message: "Server error" });
    }
}


const logout=async(req, res) =>{

    try{
        const token=req.cookies.token;
        console.log("logout "+ token);

        if (token) {
            await blackListToken.create({ token });
        }

        res.clearCookie('token', {
            httpOnly: true,
            sameSite: 'lax',
            secure: process.env.NODE_ENV !== 'development',
        });

        res.status(200).json({message: "Logout successful"});


    }catch(err){
        console.log(err);
        return res.status(401).json({ message: "Unauthorized" });
    }



}

const register = async(req, res) => {
   try{
       const {firstName, lastName, email, password,vehicle} = req.body;

       if (!vehicle) {
           return res.status(400).json({
               message: "Vehicle details are required"
           });
       }

       const {color,vehicleType,plateNumber,capacity}=vehicle;




       if(!firstName || !email || !password || !vehicleType || !plateNumber || !capacity || !color){
           return res.status(400).json({message:"Please enter all fields"});
       }
       if(!validator.isEmail(email)){
           return res.status(400).json({message:"Please enter a valid email address"});
       }

       const emailExists= await Captain.findOne({email});
       if(emailExists){
           return res.status(400).json({message:"Email already exists"});
       }




       if(!validator.isStrongPassword(password)){
           return res.status(400).json({message:"Password must be strong"});
       }

       if(color.length<3){
           return res.status(400).json({message:"Color must be atleast 3 characters"});
       }
       if(plateNumber.length<3){
           return res.status(400).json({message:"Plate number must be atleast 3 characters"});
       }
       if(capacity<1){
           return res.status(400).json({message:"Capacity must be atleast 1"});
       }

       const hashedPassword=await Captain.hashPassword(password);
       console.log(hashedPassword);


       const captain=await Captain.create({
           firstName,
           lastName,
           email,
           password: hashedPassword,
           vehicle:{
               color,
               vehicleType,
               plateNumber,
               capacity
           }
       })

       const token=captain.getSignedJwtToken();

       if(!token){
           return res.status(500).json({message:"Server error"});

       }
       console.log(token);
       res.cookie('token', token, {
           httpOnly: true,
           sameSite: 'lax',
           secure: process.env.NODE_ENV !== 'development',
           maxAge: 24 * 60 * 60 * 1000 // 24 hours
       });



       res.status(201).json({message: "Captain registered successfully"});



   }catch(err){
       console.log(err);
       res.status(500).json({ message: "Server error" });
   }
}













const captainProfile = (req, res) => {

    try{
        res.json(req.captain);
    }catch(err){
        console.log(err);
        res.status(500).json({ message: "Server error" });
    }


}


const updateProfile = (req, res) => {

}

const updatePassword = (req, res) => {

}


const updateVehicle = (req, res) => {}










module.exports = {login,register,captainProfile,updateProfile,updatePassword,updateVehicle,logout};