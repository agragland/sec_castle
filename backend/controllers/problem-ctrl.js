const Problem = require('../models/Problem')
const fs = require('fs')
const path = require('path')

createProblem = (req, res) => {
    const body = req.body
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


    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide an body',
        })
    }

    const problem = new Problem(body)

    problem.oracle_file = oracle_file
    problem.src_file = src_file

    if (!problem) {
        return res.status(400).json({ success: false, error: err })
    }

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
        problem.oracle_file = {
            data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
            contentType: 'text/plain'
        }
        problem.src_file = {
            data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
            contentType: 'text/plain'
        }
        problem.difficulty = body.difficulty

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