const express = require('express')
const app = express();
const mongoose = require('mongoose')
const session=require('express-session')
const {Server} = require('socket.io')
const cookieparser = require('cookie-parser')
console.log(process.env.a)
mongoose.connect('mongodb://localhost:27017/interview',{autoIndex:true})
const MongoStore = require('connect-mongo')(session);

const {createServer} = require('http')

const httpserver = createServer(app)
const io = new Server(httpserver,{})


global.x_session = new session({
    saveUninitialized:false,
    resave:false,
    secret:"abcdef123",
    store: new MongoStore({
        url: "mongodb://localhost:27017/interview"
    })
})
require("./sockets/socket_config")(io)
app.use(cookieparser())

app.use(xsession)

//  headers in case running frontend on other host
app.use(function(req, res, next) {
    
    res.header("Access-Control-Allow-Origin", "your_frontend");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
        res.header('Expires', '-1');
        res.header('Pragma', 'no-cache');
    next();
  })

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
app.use(require("./main/interview_mode/chat"))

app.get("*",(req,res)=>{
    res.redirect("/home")
})

io.on('connection',()=>{
    console.log("connecetd")
})
host="0.0.0.0"
httpserver.listen(3000,host)
