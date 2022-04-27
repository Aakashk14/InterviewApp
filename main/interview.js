//@candidate

const express = require('express');
const {Worker, isMainThread, parentPort,workerData} = require("worker_threads");


const router = express.Router()
const multer = require('multer');
const candidate = require('../database/queries/Candidate');
const interview_db = require("../database/queries/interviews")
const {access_control} = require("../database/queries/employers/departments")
const {Identity_fn,chat_json} = require("../main/fn");
const { fstat } = require('fs');
const chats = require('../database/queries/chats');
const { notDeepStrictEqual } = require('assert');




const storage=multer.diskStorage({
    destination:function(req,file,cb){
        let dr = `./Storage/Orgs/${req.session.org}/${req.params.dept}/`
        cb(null,dr)
    },
    filename:function(req,file,cb){
        f_name=req.body.email+"_resume"+".pdf"
        cb(null,f_name)

    }
})
const upload=multer({storage:storage,
fileFilter:async function(req,file,cb){
    let ext = file.originalname.substring(file.originalname.lastIndexOf(".")+1,file.originalname.length)
    if(ext=="pdf"){
        data = await interview_db.c_dup(req.session.org,req.params.dept,req.body.email)
            if(data==0){
                return cb(new Error("duplicate"))
            }else{
                cb(null,true)
            }
    }else{
        return cb(new Error("goes wrong"))
    }
}}).single("resume")

router.post("/candidates/new/:dept",(req,res,next)=>{
    upload(req,res,function(err){
        if(err){
            res.send("error")
            return
        }else{
            next()
        }
    })
})
router.post("/candidates/new/:dept/",async(req,res,next)=>{
if(!req.file){
   data = await interview_db.c_dup(req.session.org,req.params.dept,req.body.email)


   if(data==0){
       res.send("error")

   }else{
       next()
   }
}else{
    next()
}
})
router.post("/candidates/new/:dept/",async(req,res)=>{
//    }else if(req.session.level==0 && req.session.dept!=req.params.dept){
//       res.redirect("/home")
//   }
  
// }else{
    Identity_fn(req.session.org).then(async(id)=>{
        filename=req.file?req.file.originalname:"";
        interview_db.add_new(req.session.org,req.params.dept,req.body.name,req.body.email,req.body.applied_for,id,filename).then((data)=>{
            res.send(data==1?"done":"error")
        })
     chat_json(req.session.org,req.params.dept,req.body.email,id)
     


    })
})
router.get("/candidates/message/:dept/",async(req,res)=>{
//function add_msgC(orgid,deptname,candidate_N,message){

await interview_db.add_msgC(req.query.user,req.query.msg).then(()=>{
chats.insert_chat_a(req.session.org,req.query.user,req.query.msg,true)

res.sendStatus(200)
})
})


router.post("/candidates/delete/",async(req,res)=>{
    var filtered_candidates=[]
    t=0;
    //checking permission for each candidates
        for(x of req.body.candidates){
            if(x.length==0){
                continue
            }
           result = await interview_db.access_candidate(req.session.org,x)
           if(result==1){
               filtered_candidates[t]=x
               t++;
           }
          
        }


        for(x of filtered_candidates){

            if( req.session.level==1){
        await candidate.delete_candidate(x,req.session.org,req.body.department)
        }else if(req.session.level==0){
        //extra department check for employers
        let access = await access_control(req.session.org,req.session.userid,req.body.department)
        if(access==1){
            await candidate.delete_candidate(x,req.session.org,req.body.department).then(()=>{
            })
        }

    }else{
        res.send("error")
    }
  
}
res.send("done")

})
///candidates/${dept}/comment


router.get("/interviews/export",async(req,res,next)=>{
    if(req.session.level==0){
        next()
    }else{

       
         const  workerone= new Worker('./main/export_worker.js',{workerData:req.session.org})
          workerone.on('message',(data)=>{
              console.log("gott",data)
              res.send(data)
          })
              
          workerone.on('exit',(code) => {
            if(code != 0) 
                console.error(`Worker stopped with exit code ${code}`)
        })
    
}
})
router.get("/interviews/export",(req,res)=>{
    res.send('ERROR')
})
router.get("/download/interviews/:file",(req,res)=>{
    if(req.session.level==1){
    res.sendFile(`./Storage/Orgs/${req.session.org}/export.csv`,{root:"./"})
}
})
module.exports=router;