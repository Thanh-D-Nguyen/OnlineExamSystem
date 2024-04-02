var express = require("express");
var router = express.Router();

var questions = require("../services/trainerFunctions");
const { body } = require("express-validator");

router.post('/create',[
    body('body').isEmpty().withMessage('Invalid question!'),
    body('subject').isEmpty().withMessage('Enter subject!')
],questions.createQuestion);
router.post('/details/all',questions.getAllQuestions);
router.get('/details/:_id',questions.getSingleQuestion);
router.post('/delete',questions.deleteQuestion);



module.exports=router;

