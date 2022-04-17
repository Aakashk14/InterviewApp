const mongoose = require('mongoose')
const interviews = require('../queries/interviews')
const candidates = new mongoose.Schema({
    Name:String,
    email:String,
    Identity:String,
    Message:[String],
    Status:{type:String,default:"Pending"},
    Applied_for:String,
    Resume:String
})
const Interviews = mongoose.model("interviews",candidates)


// Interviews.create({
//     Name:"aaaaaa",
//     email:"aaaaaaaaaad@"
// })

module.exports=Interviews
