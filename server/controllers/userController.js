const User = require('../models/User.js');
const validator=require('validator');
const blackListToken=require('../models/blackListToken.js');




const register=async(req,res)=>{

    try {

        const {firstName, lastName, email, password} = req.body;

        if (!firstName || !email || !password) {
            return res.status(400).json({message: "Please enter all fields"});
        }
        if (password.length < 6) {
            return res.status(400).json({message: "Password must be atleast 6 characters"});
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({message: "Please enter a valid email address"});
        }

        const emailExists = await User.findOne({email});

        if (emailExists) {
            return res.status(400).json({message: "Email already exists"});
        }


        if (!validator.isStrongPassword(password)) {
            return res.status(400).json({message: "Password must be strong"});
        }

        const hashedPassword = await User.hashPassword(password);
        console.log(hashedPassword);

        const user = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword
        });

        await user.save();

        const token=user.getSignedJwtToken();
        console.log(token);
        res.cookie('token', token, {
            httpOnly: true,
            sameSite: 'lax',
            secure: process.env.NODE_ENV !== 'development',
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
        });


        res.status(201).json({message: "User registered successfully"});



    }catch(err){
        console.log(err);
        res.status(500).json({ message: "Server error" });

    }



};


const login=async(req,res)=>{

    try{

        const {email,password}=req.body;

        const user = await User.findOne({ email }).select('+password');

        if(!user){
            return res.status(400).json({message: "Invalid credentials"});
        }
        const isMatch=await user.matchPassword(password);


        if(!isMatch){
            return res.status(400).json({message: "Invalid credentials"});
        }
        const token=user.getSignedJwtToken();

        res.cookie('token', token, {
            httpOnly: true,
            sameSite: 'lax',
            secure: process.env.NODE_ENV !== 'development',
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
        });

        res.status(200).json({message: "Login successful"});


    }catch(err){
        console.log(err);
        res.status(500).json({ message: "Server error" });
    }

}


const profile=(req,res)=>{

    try{

        res.send(req.user);


    }catch(err){
        console.log(err);
        res.status(500).json({ message: "Server error" });
    }

}


const logout=async(req,res)=>{

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

module.exports={register,login,logout,profile};



