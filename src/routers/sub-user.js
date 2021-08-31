const express = require('express')


var checkDBConnection = require('../db/mongoose')
const SubUser =  require('../models/sub-user')

const router = new express.Router()




router.post('/subuser/login',async (req,res)=>{


    if(checkDBConnection()){
        try{
            const subUser = await SubUser.findByCredentials(req.body.email,req.body.password)
            const token = await  subUser.generateAuthToken()

            res.status(201).send({subUser,token})
        }catch(error){
            console.log("error: ",error)
            res.status(400).send(error)
        }

    }else{
        res.status(500).send('Error: DB not reachable')
    }
})



router.post('/subuser/signup',async (req,res)=>{

    const subUser = new SubUser(req.body)

    if(checkDBConnection()){

        try{
            console.log("subuser - signup path")
            await subUser.save()
            const token = await  subUser.generateAuthToken()
            res.status(201).send({subUser,token})
        }catch(error){
            console.log("error",error)
            res.status(400).send(error)
        }


    }else{
        res.status(500).send('Error: DB not reachable')
    }

})




module.exports =  router