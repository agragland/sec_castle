const mongoose = require('mongoose')
const Schema = mongoose.Schema


const Competition = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        creator: {
            type: String,
            required: true
        },
        join_id: {
            type: String,
            required: true
        },
        duration: {
            type: Number,
            required: true,
        },
        users: {
            type: [String]
        },
        problems: [{type: mongoose.Schema.Types.ObjectId, ref: 'Problem'}],
        user_flaws: [{
            user: {type: String},
            flaw: {type: String}
        }],
        status: {
            type: String,
            default: "waiting"
        },
        deadline: {
            type: Object,
        }

    },
    {
        collection: 'competitions'
    })

module.exports = mongoose.model('Competition', Competition)