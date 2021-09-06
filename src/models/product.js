const mongoose =  require('mongoose')
const validator =  require('validator')

//Name, category, available quantity, description

/*
{
        "name" :"abc_product",
        "category": "x"
        "available": "yes"
        "quantity": "10"
        "description": "good"
}
*/

/*
const Product = mongoose.model('Product',
{
    name:{type: String, required:true},
    category:{type: String, required:true},    
    available:{type: Boolean, required:true},
    quantity:{type: Number, required:true},
    description:{type: String }
})
*/
const productSchema = new mongoose.Schema(
    {
        name:{type: String,  required:true},
        category:{type: String, required:true},    
        available:{type: Boolean, required:true},
        quantity:{type: Number, required:true},
        description:{type: String }
   
    }
)



const Product = mongoose.model('Product',productSchema)


module.exports  = {"productSchema" : productSchema, "Product" : Product}