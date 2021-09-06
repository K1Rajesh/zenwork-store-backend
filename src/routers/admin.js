const express = require('express')


var checkDBConnection = require('../db/mongoose')
const Admin =  require('../models/admin')

const router = new express.Router()


/*
router.get('/admin/:emailId',async (req,res)=>{
    console.log("email id: ",req.params.emailId)

    if(checkDBConnection()){
        try{
            const admin = await Admin.findOne({email:req.params.emailId})
            console.log("login admin: ",admin,admin.name)
            res.status(201).send(`${admin.name} user Login successful`)
        }catch(error){
            res.status(400).send(error)
        }

    }else{
        res.status(500).send('Error: DB not reachable')
    }
})
*/

router.post('/admin/login',async (req,res)=>{


    if(checkDBConnection()){
        try{
            const admin = await Admin.findByCredentials(req.body.email,req.body.password)
            const token = await  admin.generateAuthToken()
            //console.log("login admin: ",adminName)
            res.status(201).send({admin,token})
        }catch(error){
            console.log("error: ",error)
            res.status(400).send(error)
        }

    }else{
        res.status(500).send('Error: DB not reachable')
    }
})



router.post('/admin/signup',async (req,res)=>{

    const admin = new Admin(req.body)

    if(checkDBConnection()){

        try{
            await admin.save()
            const token = await  admin.generateAuthToken()
            res.status(201).send({admin,token})
        }catch(error){
            res.status(400).send(error)
        }


    }else{
        res.status(500).send('Error: DB not reachable')
    }

})




module.exports =  router