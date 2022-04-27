const mongoose = require('mongoose')
const org = require('./org')
const chats  = require('./chat')

const candidates = new mongoose.Schema({
    Name:String,
    email:String,
    Identity:String,
    Status:{type:String,default:"Pending"},
    Applied_for:String,
    Resume:String,
    chats:{
        msg:{type:String},
        turn:Boolean
    }
})
const Interviews = mongoose.model("interviews",candidates)



// Interviews.create({
//     Name:"aaaaaa",
//     email:"aaaaaaaaaad@"
// })


module.exports=Interviews
