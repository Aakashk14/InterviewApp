const fs = require('fs')
const admins = require("../database/modules/admins")
const org=require("../database/modules/org")
const { identity_check } = require('../database/queries/interviews')

function seqid(){
    
    return new Promise(resolve=>{
    admins.find({}).sort({userid:-1}).then((res)=>{
       resolve(res.length==0?1:res[0].userid+1)

    })
})
}

function orgid(){
    
    return new Promise(resolve=>{
    org.find({}).sort({org_id:-1}).then((res)=>{
       resolve(res.length==0?1:res[0].org_id+1)

    })
})
}

async function Identity_fn(){
    return new Promise(async resolve=>{
        let t = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
      let str=""
        for(let i=0;i<6;i++){
            str=str+t[(Math.random()*61).toString().split(".")[0]]
        }
        let result = await identity_check(str)
        if(result==1){
            resolve(str);
        }else{
            Identity_fn()
        }
    })

}

function randpass(){
    return new Promise((resolve=>{
    var string = "abcdefgh@ijklmnopqrstuvwxyz1234567890"
        var str="";
                      
              for(let i=0;i<10;i++){
                 var rand = (Math.random()*36).toString().split(".");
                 str = str + string[rand[0]];
        }
        resolve(str);
    
}))
}




function chat_json(orgid,depname,user,id){
    fs.readFile(`./Storage/Orgs/${orgid}/${depname}/users.json`,(err)=>{
        if(err){
            var temp = {
                "users":[
                    {
                    "Name":user,
                    "Identity":id
                    }
                ]
            }
            temp = JSON.stringify(temp)
            fs.writeFile(`./Storage/Orgs/${orgid}/${depname}/users.json`,temp,(err)=>{
                if(err) {}
            })

        }else{
            var temp = {
                "Name":user,
                "Identity":id
            }
            fs.readFile(`./Storage/Orgs/${orgid}/${depname}/users.json`,(err,data)=>{
                if(err){}
                var d = JSON.parse(data)

                d['users'].push(temp);
                d=JSON.stringify(d)
                fs.writeFile(`./Storage/Orgs/${orgid}/${depname}/users.json`,d,(err)=>{
                    if(err) console.log(err)
                })

            })
        }
    })
   
}
const token_check= (req,res,next)=>{
    if(req.session.token==req.body.token || req.session.token==req.query.token){
        next()
    }else{
        res.send("Invalid")
    }

}
module.exports={
    seqid:seqid,
    orgid:orgid,
    Identity_fn:Identity_fn,
    randpass:randpass,
    chat_json:chat_json,
    token_check:token_check
}
   