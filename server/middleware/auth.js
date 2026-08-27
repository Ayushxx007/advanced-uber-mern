const jwt = require('jsonwebtoken');
const User = require('../models/User.js');
const blackListToken=require('../models/blackListToken.js');


const auth=async(req,res,next)=>{

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
        const user=await User.findById(decoded.id);
        if (!user) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }
        req.user=user;
        next();

    }catch(err){
        console.log(err);
        res.status(500).json({ message: "Server error" });

    }

}

module.exports=auth;