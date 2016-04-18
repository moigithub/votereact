'use strict';
var bcrypt = require("bcrypt");
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

//var UsersVotesSchema = new Schema({uid:String, pollOption:String});

var UsersSchema = new Schema({
	 twitter          : {
        id           : String,
        token        : String,
        displayName  : String,
        username     : String
    }
});


// methods ======================
// generating a hash
UsersSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
UsersSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};


module.exports = mongoose.model('Userreact', UsersSchema);