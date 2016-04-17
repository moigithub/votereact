'use strict';

var express = require('express');

var router = express.Router();

router.get('/', function(req, res) {
    //console.log("users req",req.user);
    return res.status(200).json(req.user);
});

router.get('/isLogged', function(req, res) {
    var status = "NOT logged in";
    if (req.isAuthenticated())
        status="Logged in";

    return res.status(200).send(status);
});


module.exports = router;

