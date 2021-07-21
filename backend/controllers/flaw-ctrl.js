const Flaw = require('../models/Flaw')

createFlaw = async (req, res) => {
    const body = req.body

    if(!body) {
        return res.status(400).json({success: false, err: 'Body not provided'})
    }

    const flaw = new Flaw(body)

    if(!flaw) {
        return res.status(400).json({ success: false, err: 'Bad Flaw'})
    }

    flaw
        .save()
        .then( () => {
            return res.status(201).json({
                success: true,
                data: flaw,
                message: 'Flaw added'
            })
        })
        .catch(err => {
            return res.status(400).json({
                err,
                message: 'Flaw not added'
            })
        })
}

getFlawsByProblemID = async (req, res) => {
    await Flaw.find({problem_id: req.params.problem_id}, (err, flaws) => {
        if(err) {
            return res.status(400).json({success: false, err: err})
        }
        if(!flaws.length) {
            return res.status(404).json({ success: false, err: `Flaws not found`})
        }
        return res.status(200).json({ success: true, data: flaws})
    })
}

getFlawByID = async (req, res) => {
    await Flaw.findOne({flaw_id: req.params.flaw_id}, (err, flaw) => {
        if(err) {
            return res.status(400).json({ success: false, err: err })
        }
        if(!flaw) {
            return res.status(404).json({ success: false, err: `Flaw not found`})
        }
        return res.status(200).json({ success: true, data: flaw})
    })
}

module.exports = {
    createFlaw,
    getFlawsByProblemID,
    getFlawByID

}