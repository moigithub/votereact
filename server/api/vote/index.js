'use strict';

var express = require('express');
var controller = require('./votes.controller');

var router = express.Router();

router.get('/pollname/:pollName', controller.findbyName);
router.get('/uid/:uid', controller.findbyuid);
router.get('/', controller.index);
router.get('/:id', controller.show);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);

module.exports = router;

