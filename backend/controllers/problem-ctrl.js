const Problem = require('../models/Problem')
const fs = require('fs')
const path = require('path')

createProblem = (req, res) => {
    const body = req.body

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide an body',
        })
    }

    //parse file information
    let filesArray = [];
    req.files.forEach((element) => {
        const file = {
            fileName: element.originalname,
            filePath: element.path,
            fileType: element.mimetype,
            fileSize: element.size
        }
        filesArray.push(file)
    })

    const oracle_file = filesArray[0]
    const src_file = filesArray[1]

    const problem = new Problem(body)

    problem.oracle_file = oracle_file
    problem.src_file = src_file

    if (!problem) {
        return res.status(400).json({ success: false, error: err })
    }

    //parse flaw information
    let string_arr = body.flaw_lines.split(",")
    let line_arr = []
    string_arr.forEach((value) => {
        line_arr.push(parseInt(value,10))
    })
    problem.flaw_lines = line_arr

    problem
        .save()
        .then( () => {
            return res.status(201).json({
                success: true,
                id: problem._id,
                message: 'Problem added!',
            })
        })
        .catch(error => {
            return res.status(400).json({
                error,
                message: 'Problem not added!',
            })
        })

}

updateProblem = async(req, res) => {
    const body = req.body

    if(!body) {
        return res.status(400).json({
            success: false,
            err: 'Body not provided'
        })
    }

    Problem.findOne( {problem_id: req.params.problem_id}, (err, problem) => {
        if(err) {
            return res.status(404).json({
                err,
                message: 'Problem not found'
            })
        }

        problem.problem_id = body.problem_id
        problem.problem_name = body.problem_name
        problem.description = body.description
        problem.difficulty = body.difficulty


        let string_arr = body.flaw_lines.split(",")
        let line_arr = []
        string_arr.forEach((value) => {
            line_arr.push(parseInt(value,10))
        })
        problem.flaw_lines = line_arr

        problem
            .save()
            .then(() => {
                return res.status(200).json({
                    success: true,
                    message: 'Problem updated'
                })
            })
            .catch(err => {
                return res.status(404).json({
                    err,
                    message: 'Problem not updated'
                })
            })
    })

}

getProblems = async (req, res) => {
    await Problem.find({}, (err, problems) => {
            if(err)
            {
                return res.status(400).json({success: false, error: err})
            }
            if(!problems.length) {
                return res
                    .status(404)
                    .json({success: false, error: `Problem not found`})
            }
            return res.status(200).json({success: true, data: problems})
    }).catch(err => console.log(err))
}

getProblemByProblemID = async (req, res) => {
    await Problem.findOne({problem_id: req.params.problem_id}, (err, problem) => {
        if(err) {
            return res.status(400).json({success: false, err: err})
        }
        if(!problem) {
            return res.status(404).json({success: false, err: `Problem not found`})
        }
        return res.status(200).json({success: true, data: problem})
    })
}

testFileUpload = async (req, res) => {
    try {
        let fileArray = [];
        req.files.forEach((file) => {
            console.log(file.originalname)
        })
        console.log(file)
        res.status(200).json({message:'uploaded'})
    }
    catch (e) {
        res.status(400).json({err: e})
    }

}

module.exports = {
    createProblem,
    updateProblem,
    getProblems,
    getProblemByProblemID,
    testFileUpload
}