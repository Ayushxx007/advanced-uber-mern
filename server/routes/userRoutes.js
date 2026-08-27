const express=require('express');
const {register,login,logout,profile}=require('../controllers/userController.js');
const auth=require('../middleware/auth.js');


const userRouter=express.Router();


userRouter.post('/register',register);
userRouter.post('/login',login);
userRouter.get('/profile',auth,profile);
userRouter.post('/logout',auth,logout);










module.exports=userRouter;