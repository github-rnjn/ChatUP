const mongoose = require("mongoose")

const connectDatabase = async()=>{
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI)
    } catch (error) {
        console.log(`Error: ${error.message}`);
    }
}

module.exports = connectDatabase