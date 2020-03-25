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
    date:{
        type:Date,
        default:Date.now
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