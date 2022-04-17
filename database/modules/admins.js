const mongoose = require('mongoose')

const admin_schema = new mongoose.Schema({
    Name:String,
    email:String,
    password:String,
    userid:Number,
    level:Boolean,  //0- admin, 1- emp
    firstlogin:Boolean
})


const admins = mongoose.model("admins",admin_schema)



module.exports=admins;