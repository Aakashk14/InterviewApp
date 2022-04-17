const org = require("../../modules/org")
const emp_db = require("../../modules/employers")
function mydepartments(email){
    return new Promise(resolve=>{
        emp_db.aggregate(
            [{
                $match:{email:email}
            },{$lookup:{
                "from":"orgs",
                "let":{"userid":"$_id"},
                pipeline:[
                    {$unwind:"$departments"},{$match:{$expr:{$in:["$$userid","$departments.Employers"]}}}
                ],
                "as":"results"}},{$project:{
                    DATA:"$results.departments"
                }}]).then((res)=>{
                if(res.length>0){
            resolve(res)
                }else{
                    resolve(0)
                }
        })
    })
}

//// to find org im assigned to and boss details

function myboss(email){
    return new Promise(resolve=>{
        emp_db.find({
            email:email
        }).then((res)=>{
            
            if(res.length >0){
            org.find({
                'departments.Employers':res[0]._id
            }).then((res)=>{
            
        
          resolve(res[0])
            })
        }else{
            resolve(0)
        }

    })
})
}
//checking if emp have access to this dep
function access_control(orgid,email,depname){
return new Promise(resolve=>{
    
    emp_db.aggregate([{
        $match:{email:email}
    },{$lookup:{
        from:"orgs",
        let:{user:"$_id"},
        pipeline:[{
            $match:{org_id:orgid}},{
            $unwind:{path:"$departments"}},{$match:{
                $expr:{
                    $in:["$$user","$departments.Employers"]
                }
            }}],
        as:"result"}},{$match:{'result.departments.Name':depname}}]).then((res)=>{
        if(res.length >0){
            resolve(1)
        }else{
            resolve(0)
        }
    })
})
}
    

    module.exports={
        mydepartments:mydepartments,
        myboss:myboss,
        access_control:access_control
    }