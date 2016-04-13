'use strict';

var _ = require('lodash');
var Votes = require('./votes.model');

// var Votes = mongoose.model('Votes', VotesSchema);

///api/votes/pollname/"+$scope.pollName)
exports.findbyName = function(req, res){
  Votes.find({"pollName":req.params.pollName}, function (err, votes) {
    if(err) { return handleError(res, err); }
    if(!votes) { return res.status(404).send('Not Found'); }
    console.log(votes,"votes");
    return res.json(votes);
  });
}


// get list by user id
exports.findbyuid = function(req, res){
  Votes.find({"createdBy":req.params.uid}, function (err, votes) {
    if(err) { return handleError(res, err); }
    if(!votes) { return res.status(404).send('Not Found'); }
    return res.json(votes);
  });
}

// Get list of votess
exports.index = function(req, res) {
  Votes.find(function (err, votess) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(votess);
  });
};

// Get a single votes
exports.show = function(req, res) {
  Votes.findById(req.params.id, function (err, votes) {
    if(err) { return handleError(res, err); }
    if(!votes) { return res.status(404).send('Not Found'); }
    return res.json(votes);
  });
};

// Creates a new votes in the DB.
exports.create = function(req, res) {
  // create html client form will have: pollName, pollOptions
  // since is a new poll creating.. :: usersVote = [] empty
  // and attach WHO is the user creating... createdBy = the user logged ID or username(since it should be unique on users collection)
  req.body.usersVote = [];
  
//  console.log("req.body",req.body);
//  console.log("name", req.body.pollName);
//  console.log("options", req.body.pollOptions);
  
  
  Votes.create(req.body, function(err, votes) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(votes);
  });
};

// Updates an existing votes in the DB.
exports.update = function(req, res) {
  console.log("votes update", req.body);
  
  
  if(req.body._id) { delete req.body._id; }
  Votes.findById(req.params.id, function (err, votes) {
    if (err) { console.log("error",err);return handleError(res, err); }
    if(!votes) { console.log("no votes found");return res.status(404).send('Not Found'); }
    //var updated = _.merge(votes, req.body);
    //var updated = _.extend(votes, req.body);
    //////////////////////
    //console.log("server update, after _merge", updated);
    console.log("find votes",votes);
    /*
    votes.createdBy = req.body["createdBy"];
    votes.pollName = req.body["pollName"];
    votes.pollOptions= req.body["pollOptions"];
    */
    votes.usersVote= req.body["usersVote"];
    
    votes.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(votes);
    });
  });
};

// Deletes a votes from the DB.
exports.destroy = function(req, res) {
  Votes.findById(req.params.id, function (err, votes) {
    if(err) { return handleError(res, err); }
    if(!votes) { return res.status(404).send('Not Found'); }
    votes.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}