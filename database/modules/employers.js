const mongoose = require('mongoose')
const org = require("../modules/org")
Schema=mongoose.Schema
const Employers_schema = Schema({
    Name:String,
    email:String,
    Status:{type:Boolean,default:0},
    otp:String

})

const Employers = mongoose.model("Employers",Employers_schema)




module.exports=Employers;
