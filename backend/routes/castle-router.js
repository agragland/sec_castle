const express = require('express');
const auth = require('../utils/auth')


const userCtrl = require('../controllers/user-ctrl');
const probCtrl = require('../controllers/problem-ctrl')
const compCtrl = require('../controllers/competition-ctrl')
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

//Competition Commands
router.post('/comp/create', auth.auth, compCtrl.createCompetition)
router.put('/comp/:join_id', auth.auth, compCtrl.updateCompetition)
router.get('/comps/:creator', auth.auth, compCtrl.getCompetitions)
router.get(`/comp/activate/:join_id`, auth.auth, compCtrl.activateCompetition)
router.get('/comp/deactivate/:join_id', auth.auth, compCtrl.endCompetition)
router.delete('/comp/delete/:join_id', auth.auth, compCtrl.deleteCompetition)
router.get('/comp/:join_id', auth.auth, compCtrl.getCompByJoinCode)
router.put('/comp/join/:join_id', auth.auth, compCtrl.joinCompetition)

//Competition Flaw Commands
router.put('/comp/flaw/:join_id', auth.auth, compCtrl.getProbFlawInfo)
router.put('/comp/flaw/update/:join_id', auth.auth, compCtrl.updateProbFlawInfo)


module.exports = router;