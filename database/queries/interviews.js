const orgs = require("../modules/org")
const candidates = require("../modules/interview")
const mongoose = require('mongoose')
const chat = require('../modules/chat')

function access_org(orgid,email){
    return new Promise(resolve=>{
orgs.find({
    Owner_email:email,
    org_id:orgid
}).then((res)=>{
    if(res.length==0){
        resolve(0)
    }else{
        resolve(1)
    }
})
    })
}
//check if we have access control over that candidate
function access_candidate(orgid,identity){
    
    return new Promise(resolve=>{
    orgs.aggregate([{
        $match:{org_id:orgid}},{$unwind:{path:"$departments"}},{
            $project:{
                interviews:"$departments.Interviews"
            }},{$lookup:{
                from:"interviews",
                let:{"user":"$interviews"},
                pipeline:[{
                    $match:{
                        $expr:{
                            $in:["$_id","$$user"]
                        }
                    }
                }],
                "as":"result"}},{$unwind:{path:"$result"}},{$match:{'result.Identity':identity}}]).then((res)=>{
                    if(res.length>0){
                        //protection
                        resolve(1)

                    }else{
                        resolve(0)
                    }
                })
            })
        }

  function c_dup(orgid,depname,email){
 return new Promise(resolve=>{
        orgs.aggregate([{
            $match:{org_id:orgid}},
            {$unwind:{path:"$departments"}},{$match:{'departments.Name':depname}},{
                $lookup:{
                    from:"interviews",
                    let:{ids:"$departments.Interviews"},pipeline:[{
                        $match:{
                            $expr:{
                                $in:["$_id","$$ids"]
                            }
                        }
                    }],
                    as:"results"
                }
            },{$match:{"results.email":email}}]).then((res)=>{
                resolve(res.length>0?0:1)
            })
        })
        
 
    }
function add_new(org_id,department_name,name_c,email_c,Position,identity,file){

    var id = new mongoose.Types.ObjectId();
return new Promise(resolve=>{


    candidates.create({
        _id:id,
        Name:name_c,
        email:email_c,
        Applied_for:Position,
        Identity:identity,
        Resume:file
    })
    orgs.findOneAndUpdate({
org_id:org_id,
'departments.Name':department_name
},{$push:{'departments.$.Interviews':id}}).exec()
resolve(1)
        })
    }

// right now checking identity uniqness with all candidates 
function identity_check(identity){
    return new Promise(resolve=>{
       candidates.find({
           Identity:identity
       }).then((res)=>{
           if(res.length==0){
               resolve(1)
           }else{
               resolve(0)
           }
       })
    })
}



function add_resume(candidate_identity,filename){
    return new Promise(resolve=>{
        candidates.findOneAndUpdate({
            identity:candidate_identity
        },{Resume:filename})
        resolve()
    })
}

function add_msgC(identity,msg,turn){
return new Promise(resolve=>{
    
        candidates.findOneAndUpdate({
            Identity:identity
        },{$push:{chats:{msg:msg,turn:false}}}).exec()
        resolve()
})
}
function interviews_all(orgid){
    return new Promise(resolve=>{
        orgs.find({
            org_id:orgid
        }).populate({path:'departments.Interviews'}).then((res)=>{
            if(res[0].departments.length > 0){

                resolve(res)
            }else{

                resolve(0)
            }
        
        
                
        
        
            
        })
    })
}

module.exports={
    add_new:add_new,
    access_org:access_org,
    identity_check:identity_check,
    add_msgC:add_msgC,
    resume:add_resume,
    access_candidate:access_candidate,
    interviews_all:interviews_all,
    c_dup:c_dup


}