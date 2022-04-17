const express = require('express')
const mongoose = require('mongoose')
const session=require('express-session')
mongoose.connect('mongodb://localhost:27017/interview',{autoIndex:true})

const cors = require('cors')
const app = express();

global.xsession= session({
resave:false,
saveUninitialized:false,
secret:"abcde123"
})
app.use(xsession)
app.set("view engine","ejs")
app.use("/static",express.static("public"))
app.use(express.json());

app.use(express.urlencoded({extended:true}));


app.use(require("./main/Accounts"))
app.use(require("./main/main"))
app.use(require("./main/dept"))
app.use(require("./main/interview"))
app.use(require("./main/settings"))
app.use(require("./main/employer"))
app.use(require("./main/candidate_public"))
app.get("*",(req,res)=>{
    res.redirect("/home")
})


host="0.0.0.0"
app.listen(3000,host)