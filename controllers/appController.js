const fspro=require('fs/promises')
const Recording=require('../models/recording')
const User=require('../models/user')
const multer=require('multer')
const {Readable}=require('stream')

exports.home_get=function(req,res){
    res.send("Hello Spectrum")
}

const storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,"./Temp")
    },
    filename:function(req,file,cb){
        cb(null,file.originalname)
    }
})
const upload=multer({storage:storage})

exports.record_post=[
    upload.array('file'),
    function(req,res){
        res.json({status:true,msg:"recording done"})
    }
]
exports.save_post=async function(req,res){
    const {name,user}=req.body
    try {
        const data=await fspro.readFile(`./Temp/${name}.mp4`)
        const doc=new Recording({
            title:name,
            video:data
        })
        await doc.save()
        await User.findByIdAndUpdate(
            {_id:user},
            {$push:{records:doc._id}}
        )
        await fspro.unlink(`./Temp/${name}.mp4`)
        res.json({status:true,msg:"recording saved"})
    } catch (error) {
        console.error(error)
        res.json({status:false,msg:"something went wrong"})
    }
}
exports.recordings_post=async function(req,res){
    const {user}=req.body
    try {
        const doc=await User.find({_id:user})
                            .populate({path:"records",select:"title created_on"})
        // console.log(doc)
        res.json({status:true,data:doc[0].records,msg:"recordings fetched"})
    } catch (error) {
        console.error(error)
        res.json({status:false,msg:"something went wrong"})
    }
}
exports.recording_delete=async function(req,res){
    const {user}=req.body
    try {
        await User.findByIdAndUpdate(
            {_id:user},
            {$pull:{records:req.params.id}}
        )
        await Recording.deleteOne({_id:req.params.id})
        res.json({status:true,msg:"recording deleted"})
    } catch (error) {
        console.error(error)
        res.json({status:false,msg:"something went wrong"})
    }
}
exports.video_get=async function(req,res){
    const range=req.headers.range
    if(!range)
        return res.status(400).send("Range is Required")
    const chunk=10**6
    const start=Number(range.replace(/\D/g,""))
    const readable=new Readable()
    readable._read=()=>{}
    try {
        const doc=await Recording.findById(req.params.id)
        const buf=Buffer.from(doc.video)
        const size=buf.length
        const end=Math.min(size-1,start+chunk)
        const contentLength=end-start+1
        const headers={
            "Content-Range":`bytes ${start}-${end}/${size}`,
            "Accept-Ranges":"bytes",
            "Content-Length":contentLength,
            "Content-Type":"video/mp4"
        }
        readable.push(buf)
        res.writeHead(206,headers)
        readable.pipe(res)
    } catch (error) {
        console.log(error)
    }
}