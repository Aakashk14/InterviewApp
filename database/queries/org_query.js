const orgs = require('../modules/org')
const {orgid}=require("../../main/fn")
const departments_details = require("../modules/interview")
const fs = require('fs')


function new_org(account_email,org_name,emails){
return orgid().then(async(id)=>{
let tn = await orgs.create({
    Name:org_name,
    org_id:id,
    Owner_email:account_email
})
tn.save()
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

module.exports={
    new_org:new_org,
    fetch_org:fetch_org
}