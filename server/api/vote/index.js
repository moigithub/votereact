'use strict';

var express = require('express');
var controller = require('./votes.controller');
var auth = require('../auth');
var router = express.Router();

router.get('/pollname/:pollName', controller.findbyName);  // find by pollName
router.get('/uid/:uid', controller.findbyuid); // find by userid
router.get('/', controller.index);     // all polls
router.get('/:id', controller.show);    // find by poll id

router.post('/', auth.isLoggedIn , controller.create); //create poll
router.put('/:id', auth.isLoggedIn , controller.update);  //update poll
router.patch('/:id', auth.isLoggedIn , controller.update);  //update poll
router.delete('/:id', auth.isLoggedIn , controller.destroy);   //delete poll

module.exports = router;

