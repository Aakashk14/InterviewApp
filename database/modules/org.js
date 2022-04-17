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
    ]
})
const orgs_schema=Schema({
    Name:String,
        org_id:Number,
        Owner_email:String,
        departments:[departments_schema]
    })

const org = mongoose.model("orgs",orgs_schema)


module.exports=org
