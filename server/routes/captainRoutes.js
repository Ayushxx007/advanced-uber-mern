const express = require('express');
const {register,login,logout,captainProfile} = require('../controllers/captainController.js');
const captainAuth=require('../middleware/captainAuth.js');
const captainRouter=express.Router();


captainRouter.post('/register',register);
captainRouter.post('/login',login);
captainRouter.get('/captainProfile',captainAuth,captainProfile);
captainRouter.post('/logout',captainAuth,logout);




module.exports=captainRouter;