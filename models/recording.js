const mongoose=require('mongoose')
const Schema=mongoose.Schema
const RecordingSchema=new Schema({
    title:{type:String,required:true},
    video:Buffer,
    created_on:{type:Date,default:Date.now}
})
RecordingSchema.virtual("url").get(function(){
    return `/video/${this._id}`
})

module.exports=mongoose.model('Recording',RecordingSchema)