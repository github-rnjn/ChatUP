//import mongoose
const mongoose = require("mongoose")
//import bcrypt
const bcrypt = require("bcryptjs")

//create user schema
const userSchema = mongoose.Schema({
    //name(r),email(r,u),password(r),pic,isAdmin(r)
    name:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    pic:{type:String,required:true,default:"https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"},
    isAdmin:{
        type:Boolean,
        required:true,
        default:false,
    }
},
{timestamps:true})

//check if the entered password is same as the registered password
userSchema.methods.matchPassword = async function (enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password)
}


userSchema.pre('save',async function(next){
    if(!this.isModified){
        next()
    }
    //create a salt of length 10
    const salt = await bcrypt.genSalt(10);
    //hash the password
    this.password = await bcrypt.hash(this.password,salt)
})

//create a user model
const User = mongoose.model('User',userSchema)

module.exports = User