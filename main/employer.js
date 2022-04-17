const express = require('express');
const router  = express.Router()

const profile_db = require("../database/queries/accounts")
const emp_db = require("../database/queries/emp")
router.post("/user/update",async(req,res)=>{
    

            profile_db.profile_update(req.session.myid,req.session.userid,req.body.name,req.body.password,false)
            emp_db.change_Status(req.session.userid)

            req.session.firstlogin=false;
            res.redirect("/home")
        }
)

router.get("/user/update",(req,res)=>{
    res.render("employer/update")
})

router.get("/")
module.exports=router;