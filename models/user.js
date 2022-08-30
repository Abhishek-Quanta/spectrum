const mongoose=require('mongoose')
const Schema=mongoose.Schema
const UserSchema=new Schema({
    name:{type:String,required:true},
    email:{type:String,required:true},
    pass:{type:String,required:true},
    records:[{type:Schema.Types.ObjectId,ref:"Recording"}]
})

module.exports=mongoose.model('User',UserSchema)