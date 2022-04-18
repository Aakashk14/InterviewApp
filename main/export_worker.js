// worker thread to export

const { workerData,parentPort, isMainThread} = require('worker_threads')
const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/interview',{autoIndex:true})

const interview_db = require("../database/queries/interviews")
const fs = require('fs')
const org = workerData
var empty=0;

interview_db.interviews_all(org).then((result)=>{

   
 let temp="Department,Name,email,Status,Applied Position \n"

if(result!=0){

for(let i=0;i<result[0].departments.length;i++){

    for(let j=0;j<result[0].departments[i].Interviews.length;j++){
        empty=1;

        temp=temp+result[0].departments[i].Name+",";
        temp=temp+result[0].departments[i].Interviews[j].Name+",";
        temp=temp+result[0].departments[i].Interviews[j].email+",";
        temp=temp+result[0].departments[i].Interviews[j].Status+",";
        temp=temp+result[0].departments[i].Interviews[j].Applied_for+",";
        temp=temp+"\n"

    }
    
}
}

if(empty!=0){
fs.writeFile(`./Storage/Orgs/${org}/export.csv`,temp,(err)=>{
    if(err){}
})

parentPort.postMessage({status:'done'})
}else{
    parentPort.postMessage({status:'error'})
}

}).catch((error)=>{
    console.log(error)
})

