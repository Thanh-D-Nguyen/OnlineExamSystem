var express = require("express");
var router = express.Router();
const { body } = require('express-validator');

var admin = require("../services/adminFunctions");

//create new Trainer
router.post('/trainer/create', [
    body('name').notEmpty().withMessage('Invalid name'),
    body('password').isLength({ min: 1, max: 16 }).withMessage('Invalid password'),
    body('emailid').isEmail().notEmpty().withMessage('Invalid email address'),
    body('contact').isLength({ min: 10, max: 33 }).isNumeric().withMessage('Invalid contact number'),
], admin.trainerRegister);
// router.post('/trainer/create',admin.trainerRegister);
router.get('/trainer/details/all',admin.getAllTrainers);
router.get('/trainer/details/:_id',admin.getSingleTrainer);
router.post('/trainer/remove',admin.removeTrainer);



module.exports=router;