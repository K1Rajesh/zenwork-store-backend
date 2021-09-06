const jwt = require('jsonwebtoken')
const Admin = require('../models/admin')
const SubUser = require('../models/sub-user')
const User = require('../models/user')

const authAdmin = async(req,res,next)=>{
    try{
        const token = req.header('Authorization').replace('Bearer ','')
        const decoded = jwt.verify(token,'zenwork')

        const admin = await Admin.findOne({_id:decoded._id,'tokens.token':token})
        if(!admin){
            throw new Error()
        }
        req.admin = admin
        next()
    }catch(err){
        res.status(401).send({error: 'Unauthorized Access'})
    }
    
}

const authSubuser = async(req,res,next)=>{
    try{
        const token = req.header('Authorization').replace('Bearer ','')
        const decoded = jwt.verify(token,'zenwork')
        console.log("authSubuser - decoded:",decoded)
        const subUser = await SubUser.findOne({_id:decoded._id,'tokens.token':token})
        console.log("authSubuser - subUser name:",subUser.name)
        if(!subUser){
            throw new Error()
        }
        req.subUser = subUser
        next()
    }catch(err){
        console.log("authSubuser - err:",err)
        res.status(401).send({error: 'Unauthorized Access'})
    }
    
}


const authUser = async(req,res,next)=>{
    try{
        const token = req.header('Authorization').replace('Bearer ','')
        const decoded = jwt.verify(token,'zenwork')
        console.log("authUser - decoded:",decoded)
        const user_result = await User.findOne({_id:decoded._id,'tokens.token':token})
        console.log("authUser - user name:",user_result.name)
        if(!user_result){
            throw new Error()
        }

        req.user_result = user_result
        req.token = token
        next()
    }catch(err){
        console.log("authUser - err:",err)
        res.status(401).send({error: 'Unauthorized Access'})
    }
    
}


module.exports = {'authAdmin':authAdmin, 'authSubuser':authSubuser, 'authUser':authUser}
