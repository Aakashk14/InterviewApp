// const mongoose=require('mongoose')

const { default: mongoose } = require("mongoose");

const emp_schema = new mongoose.Schema({
    Name:String,
    email:String,
    Status:{type:Boolean,default:0},
    otp:String
})
const departments_schema=new mongoose.Schema({
    Name:String,
    Employers:[emp_schema]
})
const orgs_schema = new mongoose.Schema({
    Name:String,
    org_id:Number,
    Owner_email:String,
    departments:[departments_schema],
    
})



const orgs = mongoose.model("orgs",orgs_schema);





module.exports=orgs