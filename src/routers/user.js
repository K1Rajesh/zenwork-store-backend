const express = require('express')


var checkDBConnection = require('../db/mongoose')
const User =  require('../models/user')
const {authUser} = require('../middleware/auth')

const router = new express.Router()


router.post('/login',async (req,res)=>{


    if(checkDBConnection()){
        try{
            const user = await User.findByCredentials(req.body.email,req.body.password)
            const token = await  user.generateAuthToken()
            //console.log("login user: ",userName)
            res.status(201).send({user:user.getPublicProfile(),token})
        }catch(error){
            console.log("error: ",error)
            res.status(400).send(error)
        }

    }else{
        res.status(500).send('Error: DB not reachable')
    }
})



router.post('/signup',async (req,res)=>{

    const user = new User(req.body)

    if(checkDBConnection()){

        try{
            await user.save()
            const token = await  user.generateAuthToken()
            res.status(201).send({user,token})
        }catch(error){
            res.status(400).send(error)
        }


    }else{
        res.status(500).send('Error: DB not reachable')
    }

})


router.post('/new-subuser',authUser,async (req,res)=>{

    const user = new User(req.body)

    if(checkDBConnection()){

        try{
            if(req.user_result.role  !== "Admin"  ){
                throw new Error("Unauthorized Access")
            }
            await user.save()
            res.status(201).send({user})
        }catch(error){
            console.log(error)
            res.status(400).send({error: 'Unauthorized Access'})
        }


    }else{
        res.status(500).send('Error: DB not reachable')
    }

})

router.post('/logout',authUser, async(req,res)=>{
    try{
        req.user_result.tokens = req.user_result.tokens.filter((token)=>{
            return token.token != req.token 
        })
        req.user_result.save()
        res.send()
    }catch(error){
        res.send(500).send()

    }
})

router.post('/logout-all',authUser, async(req,res)=>{
    try{

        req.user_result.tokens = []
        req.user_result.save()
        res.send()
    }catch(error){
        res.send(500).send()

    }
})



module.exports =  router