const mongoose =  require('mongoose')
const validator =  require('validator')

//Name, category, available quantity, description

/*
{
    "name":"Samsumng M02","category":"Mobiles","available":"yes",
    "quantity":200
    "description":
}
*/
const Product = mongoose.model('Product',
{
    name:{type: String, required:true},
    category:{type: String, required:true},    
    available:{type: Boolean, required:true},
    quantity:{type: String, required:true},
    description:{type: String }
})



module.exports  = Product