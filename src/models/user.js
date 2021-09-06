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
const userSchema = new mongoose.Schema(
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
        role:{type:String,required:true},    
        tokens:[{
            token:{
                type:String, required:true

            }
        }]    
    
    }
)

userSchema.statics.findByCredentials = async (email,password)=>{
    const user = await User.findOne({email})
    if(!user){
        console.log("User not found")
        throw new Error('Invalid credentials')
    }
    //console.log("findByCredentials",password,user.password)
    
    const isMatch =  await bcrypt.compare(password,user.password)
    
    if(!isMatch){
        throw new Error('Invalid credentials')
    }
    return user

}

userSchema.methods.getPublicProfile = function(){
    const user = this
    const userObject = user.toObject()
    delete userObject.password
    delete userObject.tokens
    return userObject

}

userSchema.methods.generateAuthToken = async function(){
    const user = this
    const token = jwt.sign({_id:user._id.toString()},'zenwork')

    user.tokens = user.tokens.concat({token})
    await user.save()
    return token

}

userSchema.pre('save',async function(next){
    const user = this
    if(user.isModified('password')){
        user.password =  await bcrypt.hash(user.password,8)
    }
    
    next()
})

const User = mongoose.model('User',userSchema)

//const isMatch = await bcrypt.compare("REd12345!",hashedPassword) 


module.exports  = User