'use strict';

var Votes = require('./api/vote/votes.model');
//var User = require('../api/user/user.model');


Votes.find({}).remove(function(){
  Votes.create({
    createdBy:1,   // _id (user id)
    pollName: "poll 1",
    pollOptions: ["option1"],
    usersVote:[{ uid:1, pollOption:"option1" }] // Object array {_id: optionName}
  },{
    createdBy:2,
    pollName: "poll 2a",
    pollOptions: ["option a1","option a2"],
    usersVote:[{ uid:1, pollOption:"option a1" },
               { uid:2, pollOption:"option a2" },
               { uid:3, pollOption:"option a2" }
              ] // Object array {_id: optionName}
  },{
    createdBy:3,
    pollName: "poll 3a",
    pollOptions: ["boo","fart","poo"],
    usersVote:[{ uid:1, pollOption:"boo" },
               { uid:2, pollOption:"boo" },
               { uid:3, pollOption:"poo" }
              ] // Object array {_id: optionName}
  }
  );
});