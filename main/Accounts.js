const express = require('express');
const db = require("../database/queries/accounts")
const router=express.Router();
const {seqid} = require("./fn")
const fs = require('fs')


router.get("/",(req,res)=>{
    if(!req.session.userid){
        res.redirect("/login")
    }else{
        res.redirect("/home")
    }
})
router.get("/login",(req,res)=>{
    res.render("login.ejs")
})

router.get("/signup",(req,res)=>{
    res.render("signup.ejs")
})
router.post("/signup",async(req,res)=>{

if(req.body.email.length==0 || req.body.password.length==0 || req.body.email.indexOf("@")==-1 || req.body.name.length==0){
    res.redirect("/error")
}else{



     await db.create(req.body.email,req.body.password,1,false,req.body.name).then((result)=>{
if(result==1){
     
         res.send("<script>alert('created'); location.href='/login'</script>")
    
     }else{
         res.send("invalid")
     }

})
}
})
router.post("/login",async(req,res,next)=>{
    console.log(req.body)

    if(req.body.email.length==0 || req.body.password.length==0 || req.body.email.indexOf("@")==-1){
        res.redirect("/error")
    }else{
        
        //setup_session
        let re = await db.login(req.body.email,req.body.password)
        if(re.length>0){

             req.session.userid=req.body.email
             req.session.myid=re[0].userid;
             req.session.level=re[0].level
             req.session.firstlogin=re[0].firstlogin;
             req.session.save((err)=>{
        
             res.redirect("/home")
             })
        
         }else{
             res.send("invalid")
         }
        }

    })


router.get("/logout",(req,res)=>{
    req.session.destroy()
    res.redirect("/login")
})
module.exports=router

