 const mongoose=require('mongoose')
Schema=mongoose.Schema
mongoose.set("debug",true)


const departments_schema=Schema({
    Name:String,
    Employers:[{
        type:Schema.Types.ObjectId,
        ref:'Employers'
    }],
    Interviews:[{
        type:Schema.Types.ObjectId,
        ref:'interviews'
    }
    ],
    chats:[{
        type:Schema.Types.ObjectId,
        ref:'chats'
    }]
})
const orgs_schema=Schema({
    Name:String,
        org_id:Number,
        Owner_email:String,
        departments:[departments_schema]
    })

const org = mongoose.model("orgs",orgs_schema)
org.aggregate([{
    $match:{org_id:1}},
    {$unwind:{path:"$departments"}},{
        $match:{"departments.Name":"Science"}},{$lookup:{
            from:"employers",
            let:{ids:"$departments.Employers"},pipeline:[{
                $match:{
                    $expr:{
                        $in:["$_id","$$ids"]
                    }
                }
            }],
            as:"results"
        }},{$match:{"results.email":"al@gmail.com"}}
    ]).then((res)=>{
            console.log(res[0])
        })


module.exports=org
