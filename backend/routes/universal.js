var express = require("express");
var router = express.Router();
const { body, validationResult } = require('express-validator');

var universal = require('../services/universalsubjectFunctions');

router.post('/create', [
    body('topic').notEmpty().withMessage('Invalid topic'),
], universal.createEditsubject);
// router.post('/create',universal.createEditsubject);
router.get('/details/all',universal.getAllSubjects);
router.get('/details/:_id',universal.getSingleSubject);




module.exports=router;
