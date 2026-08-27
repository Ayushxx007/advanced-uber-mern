const dotenv=require('dotenv').config();
const express=require('express');
const app=express();
const connectDB =require('./db/db.js');
const cookieParser = require('cookie-parser');
const cors=require('cors');
const userRoutes=require('./routes/userRoutes.js');
const captainRoutes=require('./routes/captainRoutes.js');


const port =process.env.PORT || 5000;

app.use(cookieParser());
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(cors());

app.listen(port,async ()=>{

    console.log('server is running on '+port);
    await connectDB();

});


app.get('/',(req,res)=>res.send('hello world'));
app.use('/api/users',userRoutes);
app.use('/api/captain',captainRoutes);
