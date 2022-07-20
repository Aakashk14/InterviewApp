const orgs = require('../modules/org')
const {orgid}=require("../../fn")
const interview_db = require("../modules/interview")
const emp = require("../modules/employers")
const chat_db = require("../modules/chat")
const fs = require('fs')


function new_org(org_name,account_email){
    
return orgid().then(async(id)=>{
let tn = await orgs.create({
    Name:org_name,
    org_id:id,
    Owner_email:account_email
})
tn.save()
chat_db.create({
    orgid:id
})
fs.mkdir(`./Storage/Orgs/${id}/`,{recursive:true},(err)=> console.log(err))
return
})}

function fetch_org(account_email){
    return new Promise(resolve=>{
orgs.find({
    Owner_email:account_email
}).then((res)=>{
    if(res.length ==0){
        resolve(0)
    }else{
        resolve(res)
    }
})
    })
}
function delete_org(orgid){
    return new Promise(resolve=>{
    
orgs.find({
    org_id:orgid
},'departments').then((res)=>{
    for(x of res[0].departments){
   for(y of x.Employers){
       emp.findByIdAndDelete({
           _id:y

       }).exec()
      
   }
   for(y of x.Interviews){
       interview_db.findByIdAndDelete({
           _id:y
       }).exec()

   }
}


   orgs.findOneAndDelete({
       org_id:orgid
   }).exec()
   chat_db.findOneAndDelete({
    orgid:orgid
}).exec()

  resolve()
  
})
    })
}



function total_interviews(org_id){


    return new Promise(resolve=>{
        orgs.aggregate([{
            $match:{org_id:org_id}},{
                $unwind:{path:"$departments"}},{$lookup:{
                    from:"interviews",
                    let:{"ids":"$departments.Interviews"},
                    pipeline:[{
                        $match:{
                            $expr:{
                                $in:["$_id","$$ids"]
                            }
                        }
                    }],
                    as:"results"
                }},{
                    $unwind:{path:"$results"}},{
                        $group:{
                            _id:"$_id",
                            count:{$sum : 1},
                            "pending":{
                                $sum:{
                                    $cond:[ {$eq:["$results.Status","Pending"]},1,0]
                                }},
                            "Completed":{
                                $sum:{
                                    $cond:[{$eq:["$results.Status","Completed"]},1,0]
                                }
                                
                            }}}
                        ]).then((data)=>{
        resolve(data.length>0?data:0)
                        }
                        )
})
}

function total_interviews_D(orgid,department){

    return new Promise(resolve=>{
        orgs.aggregate([{
            $match:{org_id:orgid}},{
                $unwind:{path:"$departments"}},{
                $match:{"departments.Name":department}},
                {$lookup:{
                    from:"interviews",
                    let:{"ids":"$departments.Interviews"},
                    pipeline:[{
                        $match:{
                            $expr:{
                                $in:["$_id","$$ids"]
                            }
                        }
                    }],
                    as:"results"
                }},{
                    $unwind:{path:"$results"}},{
                        $group:{
                            _id:"$_id",
                            count:{$sum : 1},
                            "pending":{
                                $sum:{
                                    $cond:[ {$eq:["$results.Status","Pending"]},1,0]
                                }},
                            "Completed":{
                                $sum:{
                                    $cond:[{$eq:["$results.Status","Completed"]},1,0]
                                }
                                
                            }}}
                        ]).then((data)=>{
                            resolve(data.length>0?data:0)
    })
})
}


function session_activities(orgid){

    return new Promise(resolve=>{
      
        orgs.aggregate([{
            $match:{org_id:orgid}
        },{$unwind:{path:"$departments"}},
        {$lookup:{
           from:"employers",
           let:{"emp":"$departments.Employers"},pipeline:[{
            $match:{
                $expr:{
                    $in:["$_id","$$emp"]}
                }
            }],
            as:"results"
        }},{$lookup:{
                from:"admins",
                let:{"results":"$results.email"},
                pipeline:[{
                $match:{$expr:{
                    $in:["$email","$$results"]}
                }}],
                as:"data"
        }},{
            $project:{
                "Result":"$data"
            }},{$unwind:{path:"$Result"}},
            {$project:{
                "result":"$Result",
        
                "data":{$size:"$Result.Activities"}}
            },
            {$group:{
                _id:"$result._id",
                "result":{$push:{
        
                   
                    $map:{
                    input:
                        {$filter:{
                            input:"$result.Activities",
                            as:"data",
                            cond:{$eq:["$$data.Activity","Logging"]}}},
                    as:"asd",
                    in:{
                    
                        
                        $concat:["$result.email","/","$$asd.Activity","+",{$dateToString:{format: "%Y-%m-%d:%H:%M:%S",date:"$$asd.Time"}  }]}
                }
            
            
            }}}}   ,{$project:{"totals":
        
        {$reduce:{
            input:"$result",
            initialValue:[],
            in:{$concatArrays:["$$value","$$this"]}
        }}}},{$group:{
                    _id:null,
                    "finalresult":{$push:{$concatArrays:"$totals"}}
            }
        },{$project:{"Output":
        
        {$reduce:{
            input:"$finalresult",
            initialValue:[],
            in:{$concatArrays:["$$value","$$this"]}
        }}}}
                    
                    
                    ]).then((data)=>{

            resolve(data.length>0?data:0)
})
    })
}

function Others_activities(orgid){
    return new Promise(resolve=>{
        orgs.aggregate([{
            $match:{org_id:orgid}
        },{$unwind:{path:"$departments"}},
        {$lookup:{
           from:"employers",
           let:{"emp":"$departments.Employers"},pipeline:[{
            $match:{
                $expr:{
                    $in:["$_id","$$emp"]}
                }
            }],
            as:"results"
        }},{$lookup:{
                from:"admins",
                let:{"results":"$results.email"},
                pipeline:[{
                $match:{$expr:{
                    $in:["$email","$$results"]}
                }}],
                as:"data"
        }},{
            $project:{
                "Result":"$data"
            }},{$unwind:{path:"$Result"}},
            {$project:{
                "result":"$Result",
        
                "data":{$size:"$Result.Activities"}}
            },
            {$group:{
                _id:"$result._id",
                "result":{$push:{
        
                   
                    $map:{
                    input:
                        {$filter:{
                            input:"$result.Activities",
                            as:"data",
                            cond:{$eq:["$$data.Activity","Candidate"]}}},
                    as:"asd",
                    in:{
                    
                        
                        $concat:["$result.email","/","$$asd.Activity","+",{$dateToString:{format: "%Y-%m-%d:%H:%M:%S",date:"$$asd.Time"}  }]}
                }
            
            
            }}}}   ,{$project:{"totals":
        
        {$reduce:{
            input:"$result",
            initialValue:[],
            in:{$concatArrays:["$$value","$$this"]}
        }}}},{$group:{
                    _id:null,
                    "finalresult":{$push:{$concatArrays:"$totals"}}
            }
        },{$project:{"Output":
        
        {$reduce:{
            input:"$finalresult",
            initialValue:[],
            in:{$concatArrays:["$$value","$$this"]}
        }}}}
                    
                    
                    ]).then((data)=>{

                        resolve(data.length>0?data:0)
    })
})
}
function ChangeLogSettings(orgid,Others){

    return new Promise(resolve=>{
        orgs.findOneAndUpdate({
            org_id:orgid,
        
        },{$set:{LogsRecording:{Others:Others}}}).exec()
        resolve(1)
    })
}

module.exports={
    new_org:new_org,
    fetch_org:fetch_org,
    delete_org:delete_org,
    total_interviews:total_interviews,
    interviews_filter:total_interviews_D,
    emp_activities:session_activities,
    Others_activities:Others_activities,
    ChangeLog:ChangeLogSettings
}
