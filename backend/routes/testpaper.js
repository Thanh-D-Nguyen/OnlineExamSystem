var express = require("express");
var router = express.Router();

var testpaper = require("../services/testpaper");
const { body } = require("express-validator");

router.post('/new/name/check',[
    body('type').isEmpty().withMessage('invalid type'),
    body('title').isEmpty().withMessage('enter title'),
    body('questions').isEmpty().withMessage('enter questions')
],testpaper.checkTestName);

router.post('/create',testpaper.createEditTest);
router.get('/details/:_id',testpaper.getSingletest);
router.post('/details/all',testpaper.getAlltests);
router.post('/delete',testpaper.deleteTest);
router.post('/basic/details',testpaper.basicTestdetails);
router.post('/questions',testpaper.getTestquestions);
router.post('/candidates',testpaper.getCandidates);
router.post('/begin',testpaper.beginTest);
router.post('/end',testpaper.endTest);
router.post('/trainer/details',testpaper.TestDetails);
router.post('/candidates/details',testpaper.getCandidateDetails);
router.post('/max/marks',testpaper.MM);


module.exports = router;
