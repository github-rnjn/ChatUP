const mongoose = require("mongoose")

//create a chat schema
const chatSchema = mongoose.Schema({
    //chat name,is group chat, users,latestmessage,groupadmin
    chatName:{type:String,trim:true},
    isGroupChat:{type:Boolean,default:false},
    users:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
        }
    ],
    latestMessage:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Message",
    },
    groupAdmin:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    }
},{
    timestamps:true,
})

//create a chat model
const Chat = mongoose.model("Chat",chatSchema)

module.exports = Chat