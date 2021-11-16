const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Problem = new Schema(
    {
        problem_id: {
            type: Number,
            required: true,
            unique: true,
        },
        problem_name: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        oracle_file: {
            fileName: String,
            filePath: String,
            fileType: String,
            fileSize: String,
        },
        src_file: {
            fileName: String,
            filePath: String,
            fileType: String,
            fileSize: String,
        },
        difficulty: {
            type: String,
            required: true
        },
        flaw_lines: [{
            type: Number
        }]
    },
    {
        collection: 'problems'
    })

module.exports = mongoose.model('Problem', Problem)