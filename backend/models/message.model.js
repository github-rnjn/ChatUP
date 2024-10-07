const mongoose = require("mongoose")

//create a message schema
const messageSchema = mongoose.Schema({
    //sender content chat readby
    sender:{type:mongoose.Schema.Types.ObjectId,ref:"User"},
    content:{
        type:String,
        trim:true,
    },
    chat:{
        type:mongoose.Schema.Types.ObjectId,ref:"Chat",
    },
    readBy:[{type:mongoose.Schema.Types.ObjectId,ref:"User"}],
},{
    timestamps:true,
})

//create a message model
const Message = mongoose.model("Message",messageSchema)

module.exports = Message