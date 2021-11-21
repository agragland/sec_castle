const Competition = require('../models/Competiton')

createCompetition = async (req, res) => {
    const body = req.body

    if(!body) {
        return res.status(400).json({
            error: 'Body not provided'
        })
    }

    const comp = new Competition(body)

    if(!comp) {
        return res.status(400).json({ success: false })
    }

    //generate join_id
    let prevent_dup = false

    while(!prevent_dup) {
        const join_id = (length = 6) => Math.random().toString(20).substr(2, length)
        comp.join_id = join_id()
        await Competition.findOne({join_id: comp.join_id}, (err, comp) => {
            if (!comp) {
                prevent_dup = true
            }
            else if(comp.status === "complete") {
                prevent_dup = true
            }
        })
    }

    comp.save()
        .then( () => {
            return res.status(201).json({
                success: true,
                comp: comp,
                message: 'Comp added'
            })
        })
        .catch(err => {
            return res.status(400).json({
                err,
                message: 'Comp not added'
            })
        })

}

getCompetitions = async (req, res) => {
    await Competition
        .find({ creator: req.params.creator })
        .populate('problems')
        .exec( (err, comps) => {
        if(err)
        {
            return res.status(400).json({success:false, err: err})
        }
        if(!comps.length) {
            return res
                .status(404)
                .json({ success: false, error: `Comps not found`})
        }
        return res.status(200).json({success: true, data: comps})
    })
}

getCompByJoinCode = async(req, res) => {
    await Competition
        .findOne({join_id: req.params.join_id})
        .populate('problems')
        .exec((err, comp) => {
            if(err) {
                return res.status(400).json({ success: false, err: err})
            }
            if(!comp) {
                return res.status(404).json({success: false, err: `Competition not found`})
            }
            return res.status(200).json({ success: true, data: comp})
        })
}

updateCompetition = async(req, res) => {
    const body = req.body

    if(!body) {
        return res.status(400).json({ success: false, err: 'Body required'})
    }

    Competition.findOne({join_id: req.params.join_id}, (err, comp) => {
        if(err) {
            return res.status(404).json({ err, message: 'Competition not found'})
        }

        comp.name = body.name
        comp.description = body.description
        comp.creator = body.creator
        comp.join_id = body.join_id
        comp.duration = body.duration
        comp.problems = body.problems
        comp.users = body.users
        comp.user_flaws = body.user_flaws
        comp.status = body.status

        comp.save()
            .then(() => {
                return res.status(200).json({
                    success: true,
                    join_id: comp.join_id,
                    message: 'Competition updated'
                })
            })
            .catch(err => {
                return res.status(404).json({
                    err,
                    message: 'Competition not updated'
                })
            })
    })
}

activateCompetition = async (req,res) => {
    Competition.findOne({join_id: req.params.join_id}, (err, comp) => {
        if(err) {
            return res.status(404).json({ err, message: 'Competition not found'})
        }
        let now = new Date()
        comp.deadline = new Date(now.getTime() + comp.duration*60000)
        comp.status = "active"

        comp.save()
            .then(() => {
                return res.status(200).json({
                    success: true,
                    join_id: comp.join_id,
                    deadline: comp.deadline,
                    message: 'Competition updated'
                })
            })
            .catch(err => {
                return res.status(404).json({
                    err,
                    message: 'Competition not updated'
                })
            })
    })

}

endCompetition = async (req, res) => {
    Competition.findOne({join_id: req.params.join_id}, (err, comp) => {
        if(err) {
            return res.status(404).json({ err, message: 'Competition not found'})
        }
        comp.status = "complete"

        comp.save()
            .then(() => {
                return res.status(200).json({
                    success: true,
                    join_id: comp.join_id,
                    message: 'Competition Completed'
                })
            })
            .catch(err => {
                return res.status(404).json({
                    err,
                    message: 'Competition could not be completed'
                })
            })
    })
}

deleteCompetition = async (req, res) => {
    await Competition.findOneAndDelete({join_id: req.params.join_id}, (err, comp) =>{
        if(err) {
            return res.status(400).json({success: false, error: err})
        }
        return res.status(200).json({success: true, message: `Competition deleted successfully`})
    }).catch(err => console.log(err))
}

joinCompetition = async (req, res) => {
    const body = req.body

    if(!body) {
        return res.status(400).json({ success: false, err: 'User required'})
    }

   await Competition
       .findOne({join_id: req.params.join_id})
       .populate('problems')
       .exec((err, comp) => {
            if (err) {
                return res.status(404).json({err, message: 'Competition not found'})
            }
           if(comp.status !== "active") {
               return res.status(200).json({err, active: false, message: 'Competition not active'})
           }
            if(comp.users.includes(body.user))
            {
                return res.status(200).json({err, joined: true, message: 'User already joined'})
            }
            else {
                comp.users.push(body.user)

                let flaw_array = []
                comp.problems.forEach(problem => {

                    flaw_array.push({
                        problem_id: problem.problem_id,
                        num_attempts: 3,
                        score: 0,
                        attempts: []
                    })
                })

                let flaw_body = {
                    user: body.user,
                    problems: flaw_array
                }
                comp.user_flaws.push(flaw_body)

                comp
                    .save()
                    .then(() => {
                        res.status(200).json({
                            success: true,
                            message: 'User added'
                        })
                    })
                    .catch(err => {
                        return res.status(404).json({
                            err,
                            message: 'User not added'
                        })
                    })
            }
    })
}

getProbFlawInfo = async(req, res) => {
    const body = req.body

    if(!body) {
        return res.status(400).json({ success: false, err: 'User required'})
    }

    await Competition
        .findOne({join_id: req.params.join_id})
        .exec((err, comp) => {
            if (err) {
                return res.status(404).json({err, message: 'Competition not found'})
            }
            let user_flaws = comp.user_flaws.find(item => item.user === body.user)

            let curr_prob = user_flaws.problems.find(item => item.problem_id === body.problem_id)

            return res.status(200).json({success: true, data: curr_prob})
        })
}

updateProbFlawInfo = async (req, res) => {
    const body = req.body

    if(!body) {
        return res.status(400).json({ success: false, err: 'User required'})
    }

    await Competition
        .findOne({join_id: req.params.join_id})
        .exec((err, comp) => {
            if (err) {
                return res.status(404).json({err, message: 'Competition not found'})
            }
            let user_flaws = comp.user_flaws.find(item => item.user === body.user)

            let curr_prob = user_flaws.problems.find(item => item.problem_id === body.problem_id)

            curr_prob.attempts = body.attempts
            curr_prob.score = body.score

            comp.save()
                .then(() => {
                    return res.status(200).json({
                        success: true,
                        attempts: curr_prob.attempts,
                        score: curr_prob.score,
                        message: 'Competition updated'
                    })
                })
                .catch(err => {
                    return res.status(404).json({
                        err,
                        message: 'Competition not updated'
                    })
                })
        })

}

module.exports = {
    createCompetition,
    updateCompetition,
    activateCompetition,
    endCompetition,
    joinCompetition,
    deleteCompetition,
    getCompetitions,
    getCompByJoinCode,
    getProbFlawInfo,
    updateProbFlawInfo
}