const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
    title : {
        type:String
    },
    body:{
        type:String
    },
    user : {
        type:Schema.Types.ObjectId,
        ref : 'doser'
    },
    status : {
        type:String,
        default:'public'
    },
    date:{
        type:Date,
        default:Date.now
    },
    allowComment:{
        type:Boolean,
        default:true
    },
    comments:[{
        commentBody:{
            type:String
        },
        commentUser:{
            type:Schema.Types.ObjectId,
            ref:'doser'
        },
        commentDate:{
            type:Date,
            default:Date.now
        }
    }]
});

//create the collection
module.exports = mongoose.model('post',postSchema);