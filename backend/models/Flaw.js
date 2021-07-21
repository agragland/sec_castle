const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Flaw = new Schema(
    {
        flaw_id: {
            type: Number,
            required: true,
            unique: true,
        },
        problem_id: {
            type: Number,
            required: true
        },
        flaw_line: {
            type: String,
            required: true
        },
    },
    {
        collection: 'flaws'
    })

module.exports = mongoose.model('Flaw', Flaw)