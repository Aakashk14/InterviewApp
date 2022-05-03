const express = require('express')
const router = express.Router()
const chat = require("../../database/queries/chats")
const db_org = require("../../database/queries/org_query")
const emp_db=require("../../database/queries/employers/departments")
const fs = require('fs')
const { candidate_page } = require('../../database/queries/Candidate')
///api/chat/search?user

router.get("/chat",async(req,res,next)=>{
    if(req.session.level==0){
        next()
    }else{
    let result = await db_org.fetch_org(req.session.userid);
    
    res.render("access.ejs",{result:result[0].departments})
    }

})
router.get("/chat",async(req,res)=>{
    let result =await emp_db.mydepartments(req.session.userid)
    res.render("access.ejs",{result:result[0].DATA})

})

router.get("/api/chat/users.json",(req,res)=>{

    fs.exists(`./Storage/Orgs/${req.session.org}/req.query.dept/users.json`,(err)=>{
    res.sendFile("users.json",{root:`./Storage/Orgs/${req.session.org}/${req.query.dept}/`})
    })
})

router.get("/api/chat/fetch",async(req,res)=>{

    let data = await chat.fetch_chat(req.session.org,req.query.to)
    res.send(data)
})
//    $.get(`/api/chat/send?msg=${msg}&to=${$(this).attr('id')}`);

router.get("/api/chat/send",async(req,res,next)=>{

if(!req.session.candidate){
 
     await chat.new_chat(req.session.myid)
    




    chat.insert_chat_a(req.session.org,req.query.to,req.query.msg,true)
    chat.insert_chat_c(req.query.to,req.query.msg,false)


    //function insert_chat(userid,to_id,msg,turn){



    //api/chat/send?to=user&msg=msg&dept=
}else{
    next()
}
})
router.get("/api/chat/send",async(req,res,next)=>{
   
    


    let data = await candidate_page(req.session.myid)

    if(data[0].chats.msg){
    chat.insert_chat_c(req.query.id,req.query.msg,true)
    chat.insert_chat_a(req.query.to,req.query.id,req.query.msg,false)


    //function insert_chat(userid,to_id,msg,turn){

    }
    res.send("error")

    //api/chat/send?to=user&msg=msg&dept=
})

router.get("/chat/department/:name",async(req,res)=>{
   // myid=req.session.myid.toString()
    let users  = await chat.users(req.session.org,req.params.name)
    res.render("chat.ejs",{users:users})
})


     
      


module.exports=router