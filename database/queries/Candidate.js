const candidate= require("../modules/interview")
const orgs = require("../modules/org")
const fs = require('fs')


function candidate_page(identity){
    return new Promise(resolve=>{
        candidate.find({
            Identity:identity
        }).then((res)=>{
            if(res.length>0){
            resolve(res)
        }else{
            resolve(0)
        }

    })
})
}
function change_status(candidate_identity,status){
    return new Promise(resolve=>{
        candidate.findOneAndUpdate({
            Identity:candidate_identity
        },{Status:status}).exec()
        resolve()
    })
}
function delete_candidate(candidate_identity,org_id,department){

    
    return new Promise(resolve=>{

        candidate.find({
            Identity:candidate_identity
        },'email _id').then((res)=>{
            fs.unlink(`./Storage/Orgs/${org_id}/${department}/${res[0].email+"_resume.pdf"}`,(err)=>{
                if(err) console.log(err)
            })

            orgs.findOneAndUpdate({
                org_id:org_id,
                'departments.Name':department
            },{$pull:{'departments.$.Interviews':res[0]._id}}).exec()
            
            
        })
        candidate.findOneAndDelete({
            Identity:candidate_identity
        }).exec()
        resolve()
    }
    )
}


function user_search(orgid,user){

user="^"+user
return new Promise(resolve=>{
orgs.aggregate([{
    $match:{org_id:orgid}
},{$unwind:{path:"$departments"}}
,{
    $lookup:{
        "from":"interviews",
        let:{users:"$departments.Interviews"},pipeline:[{
            $match:{
                $expr:{
                    $in:["$_id","$$users"]
                }
            }
        }],
        "as":"results"
}},{$unwind:{path:"$results"}},{$match:{'results.Name':{'$regex':new RegExp(user)}}},{$project:{
    data:"$results"
}}
]).then((res)=>{
    resolve(res.length>0?resolve(res):0)
})
})
}

module.exports={
    candidate_page:candidate_page,
    change_status:change_status,
    delete_candidate:delete_candidate,
    user_search:user_search
}