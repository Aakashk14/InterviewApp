
const mongoose = require('mongoose');

const admins = require("../modules/admins")
const {seqid}=require("../../main/fn")
const fs = require('fs');



function create(email,password,level,firstlogin,name){
return new Promise(resolve=>{
return seqid().then((id)=>{
   
   
       let tn = new admins(
        {
            email:email,
            password:password,
            userid:id,
            Name:name,
            level:level,
            firstlogin:firstlogin

        }
       )
       tn.save((err)=>{
          if(err){
              resolve(0)
          }else{
            fs.mkdir(`./Storage/users/${id}`,{recursive:true},(err)=>{
                if(err) console.log("got error",err)
            })
            resolve(1)
          }
       })
      
       
    
    }
)
})
}

     function login(email,password){
    return new Promise(resolve=>
         admins.find({email:email,password:password},'Name email userid firstlogin level').then((res)=>{
             
        if(res.length >0){
            resolve(res);
        }else{ resolve(0)}

    }))
}

function profile_update(userid,email,Name,password,firstlogin){
admins.findOneAndUpdate({
    userid:userid
},{email:email,Name:Name,password:password,firstlogin:firstlogin}).exec()
}
function profile(email){
return new Promise(resolve=>{
    admins.find({
        email:email
    }).then((res)=>{
        resolve(res)
    })
}
)
}


    module.exports={
        create:create,
        login:login,
        profile:profile,
        profile_update:profile_update
    }
