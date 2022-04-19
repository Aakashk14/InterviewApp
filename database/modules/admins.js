const mongoose = require('mongoose')

const admin_schema = new mongoose.Schema({
    Name:String,
    email:{type:String,unique:true},
    password:String,
    userid:Number,
    level:Boolean,  //0- admin, 1- emp
    firstlogin:Boolean
})


const admins = mongoose.model("admins",admin_schema)



module.exports=admins;
