const mongoose =  require('mongoose')
const validator =  require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const {productSchema } = require('./product')
const { User} = require('./user')

//name, email, password

/*
{
    "name":"abc_store",
    "location": "Hyderabad",
    "phone": "12345",
    "product" : {
        "name" :"abc_product",
        "category": "x",
        "available": "yes",
        "quantity": "10",
        "description": "good"
    }
}
*/

var Schema = mongoose.Schema
const storeSchema = new mongoose.Schema(
    {
        name:{type: String, unique:true, required:true},
        location:{type: String, required:true},
        phone:{type: Number, required:true},
        products: [productSchema],
        subuser : {type: Schema.Types.ObjectId,ref:'User'} 
        /*
        products:[{
            product:{
                productSchema

            }
        }]
        */ 
   
    }
)



const Store = mongoose.model('Store',storeSchema)

//const isMatch = await bcrypt.compare("REd12345!",hashedPassword) 


module.exports  = Store