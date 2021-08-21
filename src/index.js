const express = require('express')
const cors = require('cors')

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


app.get('/companies',(req,res)=>{

    res.send('<h1>Express is configured</h1>')

})


app.listen(port,()=>{
    console.log(`Server is up on port ${port}`)
})