const org = require("../modules/org")
const candidates  = require("../modules/interview")
const emp_db = require("../modules/employers")

function delete_department(orgid,depname){

    return new Promise(resolve=>{
    org.aggregate([{
        $match:{org_id:orgid}
    },{$unwind:{path:"$departments"}},{$match:{'departments.Name':depname}},{$lookup:{
        from:"interviews",
        let:{
            "candidate_id":"$departments.Interviews"
        },pipeline:[{
            $match:{
                $expr:{$in:["$_id","$$candidate_id"]}
            }}],
            as:"inter"
        }
    
    },{$lookup:{
        from:"employers",
        let:{
            "employer_id":"$departments.Employers"
        },pipeline:[{
            $match:{
                $expr:{$in:["$_id","$$employer_id"]}
            }}],
            as:"emp"
        }}]
    ).then((res)=>{
            var inters = res[0].inter;
            var emp = res[0].emp
            org.findOneAndUpdate({
                org_id:1
            },{$pull:{departments:{'Name':depname}}}).exec()
            inters.map(x=>{
               candidates.findByIdAndDelete({
                   _id:x._id
               }).exec()
            })
            emp.map(x=>{
                
                emp_db.findByIdAndDelete({
                    _id:x._id
                }).exec()
            })
            resolve(1)
    
    })
})
}


module.exports={
    delete_department:delete_department
}