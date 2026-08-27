const jwt = require('jsonwebtoken');
const Captain = require('../models/Captain.js');
const blackListToken = require("../models/blackListToken");

const captainAuth=async(req,res,next)=>{

    try{
        const token=req.cookies.token;

        if(!token){
            return res.status(401).json({message:"Unauthorized"});
        }


        const blackListed=await blackListToken.findOne({token});

        if(blackListed){
            return res.status(401).json({message:"Unauthorized"});
        }



        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        const captain=await Captain.findById(decoded.id);
        if (!captain) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }
        req.captain=captain;
        next();

    }catch(err){
        console.log(err);
        res.status(500).json({ message: "Server error" });

    }

}

module.exports=captainAuth;