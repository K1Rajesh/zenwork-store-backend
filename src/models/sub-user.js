const mongoose =  require('mongoose')
const validator =  require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

//name, email, password

/*
{
    "name":"abc"",
    "email": "abc@gmail.com"
    "password": "qwerty123"
}
*/
const subUserSchema = new mongoose.Schema(
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


subUserSchema.statics.findByCredentials = async (email,password)=>{
    const subUser = await SubUser.findOne({email})
    if(!subUser){
        console.log("SunUser not found")
        throw new Error('Invalid credentials')
    }

    
    const isMatch =  await bcrypt.compare(password,subUser.password)
    
    if(!isMatch){
        throw new Error('Invalid credentials')
    }
    return subUser

}
subUserSchema.methods.generateAuthToken = async function(){
    const subUser = this
    const token = jwt.sign({_id:subUser._id.toString()},'zenwork')

    subUser.tokens = subUser.tokens.concat({token})
    await subUser.save()
    return token

}

subUserSchema.pre('save',async function(next){
    const subUser = this
    console.log("presave - subUser: ")
    if(subUser.isModified('password')){
        subUser.password =  await bcrypt.hash(subUser.password,8)
    }
    
    next()
})

const SubUser = mongoose.model('SubUser',subUserSchema)



module.exports  = SubUser