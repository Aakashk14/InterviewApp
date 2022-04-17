const candidate= require("../modules/interview")
const orgs = require("../modules/org")


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
        },'_id').then((res)=>{
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


module.exports={
    candidate_page:candidate_page,
    change_status:change_status,
    delete_candidate:delete_candidate
}