const mong = require('mongoose');
const Schema = mong.Schema;

const userSchema = new Schema({
    fullname : {
        type:String,
        default:''
    },
    firstname : {
        type:String,
        default:''
    },
    lastname : {
        type:String,
        default:''
    },
    email:{
        type:String,
        default:''
    },
    image:{
        type: String,
        default:''
    },
    phone:{
        type:Number
    },
    location:{
        type:String
    },
    fbTokens:Array,
    facebook:{
        type:String
    },
    google : {
        type:String
    },
    instagram : {
        type:String
    }
});

//create the collection
module.exports = mong.model('doser',userSchema);