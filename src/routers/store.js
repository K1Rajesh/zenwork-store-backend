const express = require('express')
const {authUser} = require('../middleware/auth')

var checkDBConnection = require('../db/mongoose')
const Store =  require('../models/store')

const router = new express.Router()


router.get('/stores',authUser , async (req,res)=>{

    if(checkDBConnection()){
        var stores
        if(req.user_result.role  === "Admin"  ){
             stores = await Store.find({})
        }
        else{
             stores = await Store.find({subuser:req.user_result._id})
        }


        res.send(stores)
    }else{
        res.status(500).send('Error: DB not reachable')
    }

})


router.post('/create-store', authUser, async (req,res)=>{

    const store = new Store(req.body)

    if(checkDBConnection()){

        try{

            if(req.user_result.role  !== "Admin"  ){
                throw new Error("Unauthorized Access")
            }
            
            await store.save()
            res.status(201).send('store insert successful: ')
        }catch(error){
            console.log(error)
            res.status(400).send(error)
        }


    }else{
        res.status(500).send('Error: DB not reachable')
    }

})

router.patch('/update-store-details/:id', authUser, async (request,response)=>{


    if(checkDBConnection()){

        const updates = Object.keys(request.body)

        const allowedUpdates = ['name','location','phone','subuser']
        const isValidOperation = updates.every((update)=>allowedUpdates.includes(update))

        if(!isValidOperation){
            return response.status(404).send({error:"Invalid update!"})
        }
        
        try{

            if(request.user_result.role  !== "Admin"  ){
                throw new Error("Unauthorized Access")
            }

            const store = await Store.findById(request.params.id)
            updates.forEach((update)=>store[update]=request.body[update])
            await store.save()

            

            //console.log("login admin: ",adminName)
            response.status(201).send({store})
        }catch(error){
            console.log("error: ",error)
            response.status(400).send({error})
        }

    }else{
        res.status(500).send('Error: DB not reachable')
    }
})

router.patch('/update-store-products/:id', authUser, async (request,response)=>{


    if(checkDBConnection()){

        const updates = Object.keys(request.body)

        const allowedUpdates = ['products']
        const isValidOperation = updates.every((update)=>allowedUpdates.includes(update))

        if(!isValidOperation){
            return response.status(404).send({error:"Invalid update!"})
        }
        try{
            const store = await Store.findById(request.params.id)

            updates.forEach((update)=>store[update]=request.body[update])


            await store.save()

            

            //console.log("login admin: ",adminName)
            response.status(201).send({store})
        }catch(error){
            console.log("error: ",error)
            response.status(400).send({error})
        }

    }else{
        res.status(500).send('Error: DB not reachable')
    }
})








module.exports =  router