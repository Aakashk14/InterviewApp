const express = require('express');
const router = express.Router()
const candidate_db = require("../database/queries/Candidate")
const fs = require('fs');

router.get("/pvt/:link",async(req,res)=>{
let result = await candidate_db.candidate_page(req.params.link)
if (result!=0){
   res.render("candidate.ejs",{result:result})
}else{
    res.send("NOT ALLOWED")
}
})


router.get("/candidates/resume/:name",(req,res)=>{
    
    let dr = `./Storage/Orgs/${req.session.org}/${req.params.name}`
res.sendFile(dr,{root:"./"})

})
router.get("/candidates/status",async(req,res)=>{


   await candidate_db.change_status(req.query.user,req.query.status).then(()=>
   {
       res.send("DONE")
   })

})
module.exports=router;