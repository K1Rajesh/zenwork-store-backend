const express = require('express')

var checkDBConnection = require('../db/mongoose')
const Product =  require('../models/product')

const router = new express.Router()

router.get('/products',(req,res)=>{
    

    if(checkDBConnection()){
        Product.find({}).then((products)=>{
            res.send(products)
        }).catch((error)=>{
            res.status(400).send(error)
        })
    }else{
        res.status(500).send('Error: DB not reachable')
    }
})

router.get('/product/:id',(req,res)=>{

    if(checkDBConnection()){
        Product.findById({_id:req.params.id}).then((product)=>{
            if(!product){
                return res.status(404).send("No records found")
            }
            res.send(product)
        }).catch((error)=>{
            res.status(400).send(error)
        })
    }else{
        res.status(500).send('Error: DB not reachable')
    }
})

router.post('/product',(req,res)=>{

    const product = new Product(req.body)
    console.log(checkDBConnection())
    if(checkDBConnection()){
        product.save().then((result)=>{
            console.log("Successfully inserted record")
            res.status(201).send(`Successfully inserted record : ${result.name}`)
        }).catch((error)=>{
            res.status(400).send(error)
            
        })
    }else{
        res.status(500).send('Error: DB not reachable')
    }

})

module.exports =  router