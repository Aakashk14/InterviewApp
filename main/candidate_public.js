const express = require('express');
const router = express.Router()
const candidate_db = require("../database/queries/Candidate")
const fs = require('fs');

router.get("/pvt/:id/:link",async(req,res)=>{

if(req.session.level){
res.send("<script>alert('this is candidate link , the current session is of admin');location.href='/home'</script>")
}else{
let result = await candidate_db.candidate_page(req.params.link)

if (result!=0){
req.session.candidate=1;
req.session.org=req.params.id
req.session.myid=req.params.link
   res.render("candidate.ejs",{result:result})

}else{
    res.send("NOT ALLOWED")
}
}
})


router.get("/candidates/:dept/resume/:email/resume.pdf",(req,res)=>{
    f_name= req.params.email+"_resume.pdf"
    let dr = `./Storage/Orgs/${req.session.org}/${req.params.dept}/${f_name}`
    res.contentType("application/pdf");
    fs.createReadStream(dr).pipe(res)
//res.sendFile(dr,{root:"./"})

})
router.get("/candidates/status",async(req,res)=>{


    await candidate_db.change_status(req.query.user,req.query.status).then(()=>
    {
        res.send("DONE")
    })
 
 })
module.exports=router;