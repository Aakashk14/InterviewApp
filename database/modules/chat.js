const mongoose = require('mongoose')
//for admins
const raw_text= new mongoose.Schema({
    text:String,
    turn:Boolean
})

const messages_schema = new mongoose.Schema({
    to_id:String,
    text:[raw_text]
})
const chats_schema = new mongoose.Schema({
    orgid:{type:String,unique:true},
    chats_arr:[messages_schema]
})

//for candidates


const chats = mongoose.model("chats",chats_schema)


module.exports=chats;