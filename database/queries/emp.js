const org = require("../modules/org")
const {create}=require("../queries/accounts")
const {randpass,seqid} = require("../../main/fn")
const employer = require("../modules/employers")
const mongoose=require('mongoose')


function add(orgid,depname,email_E){
    var id = new mongoose.Types.ObjectId();
return randpass().then((otp)=>{
    return new Promise(resolve=>{
        employer.create({
            _id:id,
            email:email_E,
            otp:otp
        })
        org.findOneAndUpdate({
    org_id:orgid,
    'departments.Name':depname
},{$push:{'departments.$.Employers':id}}).exec()
        

create(email_E,otp,0,true)
resolve()

        
})})}

function fetch_ALLemp(orgid){
    return new Promise(resolve=>{
        
           org.find({
            org_id:orgid,
            }).populate({
              path:'departments.Employers'}).then((res)=>{
                  if(res.length >0){
                      resolve(res)
                  }else{
                      resolve(0)
                  }
              }
              )

            })
        }
function change_Status(employer_E){
    employer.findOneAndUpdate({
        email:employer_E
    },{Status:1,otp:"__"}).exec()


}

module.exports={
    add_emp:add,
    all_emp:fetch_ALLemp,
    change_Status:change_Status
}