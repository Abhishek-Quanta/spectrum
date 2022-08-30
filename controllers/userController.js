const bcrypt=require('bcrypt')
const saltRounds=10
const User=require("../models/user")

exports.register_post=async function(req,res){
    const {name,email,pass}=req.body
    try {
        // console.log(req.body,name,email,pass)
        var user=await User.findOne({email:email})
        if(user){
            console.log('user present',user)
            return res.json({status:false,msg:"emailExists"})
        }
        const hashPass=await bcrypt.hash(pass,saltRounds)
        user=new User({
            name:name,
            email:email,
            pass:hashPass
        })
        await user.save()
        res.json({status:true,msg:"account created"})
    } catch (error) {
        // console.log(error)
        res.json({status:false,msg:"something went wrong"})
    }
}
exports.login_post=async function(req,res){
    const {email,pass}=req.body
    try {
        console.log("request login",email)
        const user=await User.findOne({email:email})
        if(!user)
            return res.json({status:false,msg:"noUser"})
        const matched=await bcrypt.compare(pass,user.pass)
        if(!matched){
            return res.json({status:false,msg:"incorrect"})
        }
        req.session.auth=email
        await req.session.save()
        res.json({status:true,user:user._id,msg:"logged in"})
    } catch (error) {
        console.log(error)
        res.json({status:false,msg:"something went wrong"})
    }
}
exports.logout=function(req,res){
    req.session.destroy(err=>{
        if(err){
            return res.json({status:false,msg:"something went wrong"})
        }
        res.json({status:true,msg:"logged out"})
    })
    // try {
    //     await req.session.destroy()
    //     res.json({status:true,msg:"logged out"})
    // } catch (error) {
    //     // console.log(error)
    //     res.json({status:false,msg:"something went wrong"})
    // }
}
exports.auth=function(req,res,next){
    if(req.session.auth)
        return next()
    res.json({status:false,msg:"noAuth"})
}