const mongoose =  require('mongoose')
const validator =  require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

//name, email, password

/*
{
    "name":"abc",
    "email": "abc@gmail.com",
    "password": "qwerty123"
}
*/
const adminSchema = new mongoose.Schema(
    {
        name:{type: String, required:true},
        email:{type: String, unique:true, required:true,
                validate(value){
                    if(!validator.isEmail(value)){
                        throw new Error('Email is invalid')
                    }
                }
              },    
        password:{type: String, required:true,minlength:7,trim:true,
            validate(password){
                invaidCharectars = ['=']
                containsInvaidCharectars = invaidCharectars.find((invaidCharectar)=>{
                    return password.includes(invaidCharectar)
                })
                if(containsInvaidCharectars){
                    throw new Error('Password contains invalid charectars')
                }
        
            }},
        tokens:[{
            token:{
                type:String, required:true

            }
        }]    
    
    }
)

adminSchema.statics.findByCredentials = async (email,password)=>{
    const admin = await Admin.findOne({email})
    if(!admin){
        console.log("Admin not found")
        throw new Error('Invalid credentials')
    }
    //console.log("findByCredentials",password,admin.password)
    
    const isMatch =  await bcrypt.compare(password,admin.password)
    
    if(!isMatch){
        throw new Error('Invalid credentials')
    }
    return admin

}
adminSchema.methods.generateAuthToken = async function(){
    const admin = this
    const token = jwt.sign({_id:admin._id.toString()},'zenwork')

    admin.tokens = admin.tokens.concat({token})
    await admin.save()
    return token

}

adminSchema.pre('save',async function(next){
    const admin = this
    if(admin.isModified('password')){
         admin.password =  await bcrypt.hash(admin.password,8)
    }
    
    next()
})

const Admin = mongoose.model('Admin',adminSchema)

//const isMatch = await bcrypt.compare("REd12345!",hashedPassword) 


module.exports  = Admin