const express = require('express');
const auth = require('../utils/auth')


const userCtrl = require('../controllers/user-ctrl');
const probCtrl = require('../controllers/problem-ctrl')
const compCtrl = require('../controllers/competition-ctrl')
const flawCtrl = require('../controllers/flaw-ctrl')
const upload = require('../utils/fileUpload')

const router = express.Router();

//User Commands
router.post('/user/signup', userCtrl.user_signup);
router.post('/user/signin', userCtrl.user_signin);
router.get('/user/signout', userCtrl.user_signout);
router.get('/user/logged', userCtrl.user_logged);

//Problem Commands
router.post('/problem', auth.auth, upload.upload.array('files'),  probCtrl.createProblem)
router.put('/problem/:problem_id', auth.auth, probCtrl.updateProblem)
router.get('/problem', auth.auth, probCtrl.getProblems)
router.get('/problem/:problem_id', auth.auth, probCtrl.getProblemByProblemID)
router.post('/problemTest',upload.upload.array('files'), probCtrl.testFileUpload)

//Flaw Commands
router.post('/flaw', auth.auth, flawCtrl.createFlaw)
router.get('/flaws/:problem_id', auth.auth, flawCtrl.getFlawsByProblemID)
router.get('/flaw/:flaw_id', auth.auth, flawCtrl.getFlawByID)

//Competition Commands
router.post('/comp/create', auth.auth, compCtrl.createCompetition)
router.put('/comp/:join_id', auth.auth, compCtrl.updateCompetition)
router.get('/comps/:creator', auth.auth, compCtrl.getCompetitions)
router.get(`/comp/activate/:join_id`, auth.auth, compCtrl.activateCompetition)
router.get('/comp/:join_id', auth.auth, compCtrl.getCompByJoinCode)
router.put('/comp/join/:join_id', auth.auth, compCtrl.joinCompetition)


module.exports = router;