const mongoose =  require('mongoose')


const connectionURL = 'mongodb://127.0.0.1:27017'
const databaseName = 'zenwork-store-manager-api'

isDBConnected = false

const connection_promise = mongoose.connect(connectionURL +"/" + databaseName,
{useNewUrlParser:true, useCreateIndex:true})




connection_promise.
then((result)=>{
    isDBConnected = true
    console.log("Successfully connected to db...")


}). 
catch((error)=>{
    console.log("Unable to connect to db!!!",error)
})

function checkDBConnection(){
    return isDBConnected
}

module.exports  = checkDBConnection