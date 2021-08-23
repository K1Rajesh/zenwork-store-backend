const express = require('express')
const cors = require('cors')

var checkDBConnection = require('./db/mongoose')
const Product =  require('./models/products')



const app = express()
const port = process.env.PORT || 3000 //3000, 80 

app.use((req,res,next)=>{
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Headers","Origin,X-Requested-With,Content-Type,Accept");
    if(req.metho==='OPTIONS'){
        res.header('Access-Control-Allow-Methods','PUT,POST,GET,PATCH,DELETE')
        return res.status(200).json({})
    }
    next();

})



app.use(cors())

app.use(express.json())

app.get('/products',(req,res)=>{
    

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

app.get('/product/:id',(req,res)=>{

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

app.post('/product',(req,res)=>{

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



app.listen(port,()=>{
    console.log(`Server is up on port ${port}`)
})