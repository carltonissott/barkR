const mongoose = require('mongoose')

const Schema = mongoose.Schema
const petSchema = new Schema({
    petName: {
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    owner:{
        type:Schema.Types.ObjectId,
        ref:"Users",
        required:true
    }
})
module.exports = mongoose.model('Pets', petSchema)