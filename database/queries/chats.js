const chats = require('../modules/chat')
const candidates = require('../modules/interview')
const orgs = require("../modules/org")


function new_chat(userid){

    return new Promise(resolve=>{
      chats.create({
          orgid:userid
      })
      resolve()
    })


}

function insert_chat_a(orgid,to_id,msg,turn){
  
chats.find({
    orgid:orgid,
    'chats_arr.to_id':to_id
}).then((res)=>{
    if(res.length>0){
        chats.findOneAndUpdate({
            orgid:orgid,
            'chats_arr.to_id':to_id
        },{$push:{'chats_arr.$.text':{text:msg,turn:turn}}}).exec()
        

    }else{
chats.findOneAndUpdate({
    orgid:orgid
},{$push:{chats_arr:{to_id:to_id}}}).exec()
chats.findOneAndUpdate({
    orgid:orgid,
    'chats_arr.to_id':to_id
},{$push:{'chats_arr.$.text':{text:msg,turn:turn}}}).exec()

    }

})
}

function insert_chat_c(identity,msg,turn){

        candidates.findOneAndUpdate({
            Identity:identity
        },{$push:{chats:{msg:msg,turn:turn}}}).exec()
    
}

function users(orgid,depname){
    return new Promise(resolve=>{
  
orgs.aggregate([{
    $match:{org_id:orgid}
},{$unwind:{path:"$departments"}},{$match:{'departments.Name':depname}},{
    $lookup:{
        from:"interviews",
        let:{ids:"$departments.Interviews"},pipeline:[{$match:{
                    $expr:{
                        $in:["$_id","$$ids"]
                    }
                }
            }
        ],
        as:"results"
    }
},{$unwind:{
    path:"$results"
}},{$match:{"results.chats":{$exists:true}}}
]).then((res)=>{
    resolve(res.length>0?res:0)
})

    })
}

function fetch_chat(userid,to_id){
    return new Promise(resolve=>{
    chats.find({
        orgid:userid,
        'chats_arr.to_id':to_id
    },'chats_arr.$').then((res)=>{
        console.log(res)
        resolve(res.length>0?res[0].chats_arr[0].text:0)
    })
})
}

module.exports={
    users:users,
    fetch_chat:fetch_chat,
    new_chat:new_chat,
    insert_chat_a:insert_chat_a,
    insert_chat_c:insert_chat_c
}


