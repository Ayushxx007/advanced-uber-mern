const dotenv=require('dotenv').config();
const express=require('express');
const app=express();
const connectDB =require('./db/db.js');


const cors=require('cors');

const port =process.env.PORT || 5000;
app.use(express.json());
app.use(cors());

app.listen(port,async ()=>{

    console.log('server is running on '+port);
    await connectDB();

});


app.get('/',(req,res)=>res.send('hello world'));

