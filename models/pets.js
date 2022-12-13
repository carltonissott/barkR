const mongoose = require('mongoose')

const Schema = mongoose.Schema
const petSchema = new Schema({
    name: {
        type:String,
        required:true
    },
    type:{
        type:String,
        required:true
    },

    phone:{
        type:String,
        required:true
    },
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    }
})
module.exports = mongoose.model('Pet', petSchema)