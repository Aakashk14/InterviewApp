const express = require('express');

const router = express.Router()
const multer = require('multer')
const emp_db = require("../database/queries/emp");
const admins = require('../database/queries/accounts')
const dept_db = require('../database/queries/dept')
const fs = require('fs')


const storage=multer.diskStorage({
    destination:function(req,file,cb){
        dr=`./Storage/users/${req.session.myid}`
        cb(null,dr)

    },
    filename:function(req,file,cb){
        a=file.originalname.split(".");
        a=a[a.length-1]
        temp="profile."+a
        cb(null,temp)
    }
})
const upload=multer({storage:storage}).single("file")
//Employers

router.get("/org/settings",(req,res)=>{

    res.render("settings.ejs")
})

router.get("/emp/settings",async(req,res)=>{
let emp = await emp_db.all_emp(req.session.org)
    res.render("emp.ejs",{emp:emp})
})
//function add(orgid,depname,email_E,Name_E){


router.get("/emp/add",async(req,res)=>{

    await emp_db.add_emp(req.session.org,req.query.department,req.query.email).then(()=>{
       
            res.send("DONE")
      
})
})
router.get("/departments/settings",async(req,res)=>{
    if(req.session.userid){
        let result=  await dept_db.all_departments(req.session.userid,req.session.org)
        res.render("departments_setting.ejs",{result:result})
    }else{
        res.send("No Permission")
    }
})


//profile settings

router.get("/profile/settings",async(req,res)=>{
let result = await admins.profile(req.session.userid)
   

    if(req.session.level==1){

    res.render("profile.ejs",{result:result})
    }else{
        res.render("employer/profile.ejs",{result:result})
    }


})

router.post("/profile/update",async(req,res)=>{
await admins.profile_update(req.session.myid,req.body.email,req.body.name,req.body.password).then(()=>{
    res.redirect("/profile/settings")
})
})

router.post("/profile/dp",(req,res)=>{
    upload(req,res,(err)=>{
        if(err){
            res.send("ERROR")
        }else{
            res.send("DONE")
        }
    })
})

router.get("/profile/image/:name",(req,res)=>{
   dp= fs.readdirSync(`./Storage/users/${req.session.myid}`).filter(x=>x.startsWith("profile"))
   dp=dp.length>0?`./Storage/users/${req.session.myid}/${dp}`:'./Storage/default.png'

res.sendFile(dp,{root:"./"})
})
module.exports=router