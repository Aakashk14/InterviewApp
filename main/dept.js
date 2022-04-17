const express = require('express');
const {department_add,fetch_department, department_setup} = require("../database/queries/dept");
const emp = require('../database/queries/employers/departments')
const router=express.Router();


router.post("/department/add",async(req,res)=>{
if(req.body.value.length==0){
    res.redirect("/error")
}else{
await department_add(req.session.userid,req.body.value).then((result)=>{
    res.send(result==1?req.body.value:"ERROR")
})
}
})

router.get("/department/:name",async(req,res,next)=>{
       if(!req.session.userid){
           res.redirect("/error")
       }else{
           next()
       }
    })


router.get("/department/:name",async(req,res,next)=>{
    if(req.session.level==0){
        next() // to not let emp access any other dep
    }else{
   let result =  await fetch_department(req.session.org,req.params.name)
   result=result==0?1:result
       res.render("department_home.ejs",{result:result})
   }
}
)
router.get("/department/:name",async(req,res)=>{
      let result = await emp.mydepartments(req.session.userid)
     if(result[0].DATA[0].Name==req.params.name){

    
   
        result = await fetch_department(req.session.org,req.params.name)
        result=result==0?1:result
        req.session.dept=req.params.name
    
        res.render("employer/dept.ejs",{result:result})
     }else{
         res.redirect("/home")
     }

    
})


module.exports=router;