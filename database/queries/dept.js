const orgs = require('../modules/org')
const departments_details = require('../modules/interview')
const org = require('../modules/org')


function department_add(email,name){
    
return new Promise(resolve=>{
    orgs.find({
        Owner_email:email,
        'departments.Name':name
    }).then((res)=>{
        if(res.length == 0){
    orgs.findOneAndUpdate({
        Owner_email:email,
    },{$addToSet:{departments:{Name:name}}}).then((err)=>{
        
        resolve(1)
    })
}else{
    resolve(0)
}
    })
})
}
// function department_setup(orgid,department_N){
//     departments_details.findOneAndUpdate({
//         org_id:orgid
//     },{$push:{Interviews:{department_Name:department_N}}}).exec()
 
// }
function fetch_department(orgid,deptname){
    console.log("eeee",orgid,deptname)
return new Promise(resolve=>{
        
orgs.aggregate([{
    $match:{org_id:orgid}
},{$unwind:{path:"$departments"}},{$match:{'departments.Name':deptname}},{$project:{
    Interviews:"$departments.Interviews",
    _id:0,
}},{$lookup:{
    from:"interviews",
    let:{
        "candidate_id":"$Interviews"
    },pipeline:[{
        $match:{
            $expr:{$in:["$_id","$$candidate_id"]}
        }}],
        as:"data"
    }}]).then((res)=>{
        if(res.length>0){
            resolve(res[0].data)
        }else{
            resolve(0)
        }

    })
})
}
      
function all_departments(email,orgid){
    return new Promise(resolve=>{
        org.find({
            org_id:orgid,
            Owner_email:email
        },'departments').populate({path:'departments.Employers'}).then((res)=>{
            if(res.length >0){
                let result=[]
                for(let i=0;i<res[0].departments.length;i++){
                    result[i]={Name:res[0].departments[i].Name}
                    result[i].count=[res[0].departments[i].Employers.length];
            
                }
            resolve(result)
}else{
    resolve(0)
}
        })
    })
}

module.exports={
    department_add:department_add,
    fetch_department:fetch_department,
    all_departments:all_departments
}