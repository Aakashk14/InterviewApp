const express = require('express');
const db_org = require("../database/queries/org_query")
const emp_db = require("../database/./queries/employers/departments")
const fs = require('fs');
const router=express.Router();


router.get("/org/setup",(req,res)=>{
    if(req.body.name=="" || !req.session.userid || req.session.level==0){
        res.redirect("/home?error=1")
    }else{
res.render("setup.ejs")
    }
})
router.post("/org/new",async(req,res)=>{
    emails=[]
    if(req.body.name=="" || !req.session.userid || req.session.level==0){
        res.redirect("/home?error=1")
    }else if(req.body.email.length >0){
        emails=req.body.email.split(",")   // dont forget to verify emails here like if email is already member
    }
    await db_org.new_org(req.session.userid,req.body.name,emails)
    

    //function new_org(account_email,org_name,emails){
    
    res.redirect("/home")
    

})


router.get("/home",async(req,res,next)=>{
   
  if(req.session.level==0){
      next()
  }else{
    req.session.boss=0
    let result = await db_org.fetch_org(req.session.userid);
    if(result==0){

        res.redirect("/org/setup")
    }else{
        req.session.org=result[0].org_id
       

        res.render("home.ejs",{result:result})
        
    }
}
})


 router.get("/home",async(req,res)=>{ 
     
  ({org_id:req.session.org,Owner_email:req.session.boss} = await emp_db.myboss(req.session.userid))
  if(req.session.firstlogin==true){
    res.redirect("/user/update")
}else{

      let result = await emp_db.mydepartments(req.session.userid)
     result=result!=0?result[0].DATA:0
     res.render("employer/home.ejs",{result:result})
     }
    })

module.exports=router