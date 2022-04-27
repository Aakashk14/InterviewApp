const orgs = require('../modules/org')
const {orgid}=require("../../main/fn")
const departments_details = require("../modules/interview")
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

  resolve()
  
})
    })
}
module.exports={
    new_org:new_org,
    fetch_org:fetch_org,
    delete_org:delete_org
}