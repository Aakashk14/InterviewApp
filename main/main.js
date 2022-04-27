const express = require('express');
const db_org = require("../database/queries/org_query")
const emp_db = require("../database/./queries/employers/departments")
const fs = require('fs');
const {token_check} =require('./fn')
const router=express.Router();
const session_chk=(req,res,next)=>{
    if(!req.session.userid){
        res.redirect("/login")
    }else{
        next()
    }
}

router.get("/org/setup",(req,res)=>{
    
    if(req.session.org){
        res.redirect("/home")
    }else if(req.session.org){
        res.redirect("/home")
    }else{
res.render("setup.ejs",{token:req.session.token})
    }
})
router.post("/org/new",token_check,async(req,res)=>{
    console.log(req.body)
    emails=[]
    if(req.body.name==""){
        res.redirect("/org/setup")
    }else {
    await db_org.new_org(req.body.org,req.session.userid)    

    //function new_org(account_email,org_name,emails){
    
    res.redirect("/home")
    }

})


router.get("/home",session_chk,async(req,res,next)=>{
   
  if(req.session.level==0){
      next()
  }else{
    req.session.boss=0
    let result = await db_org.fetch_org(req.session.userid);
    if(result==0){

        res.redirect("/org/setup")
    }else{
        req.session.org=result[0].org_id
        req.session.org_N=result[0].Name
        res.cookie("org",result[0].Name)
        res.cookie("orgid",req.session.org)
       

        res.render("home.ejs",{result:result,level:req.session.level,token:req.session.token})
        
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