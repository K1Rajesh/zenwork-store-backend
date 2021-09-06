const express = require('express')
const cors = require('cors')



const productRouter =  require('./routers/product')
const adminRouter =  require('./routers/admin')
const subUserRouter =  require('./routers/sub-user')
const userRouter =  require('./routers/user')
const storeRouter =  require('./routers/store')


const app = express()
const port = process.env.PORT || 3000 //3000, 80 

/*
app.use((req,res,next)=>{
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Headers","Origin,X-Requested-With,Content-Type,Accept");
    if(req.method==='OPTIONS'){
        res.header('Access-Control-Allow-Methods','PUT,POST,GET,PATCH,DELETE')
        return res.status(200).json({})
    }
    next();

})
*/



app.use(cors())

app.use(express.json())


app.use(productRouter)
app.use(adminRouter)
app.use(subUserRouter)
app.use(userRouter)
app.use(storeRouter)




app.listen(port,()=>{
    console.log(`Server is up on port ${port}`)
})


