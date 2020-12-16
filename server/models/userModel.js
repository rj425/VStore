// Importing Required Modules
const mongoose=require('mongoose');
const bcrypt=require('bcryptjs');
const config=require('../config/database');

// User Schema
const UserSchema=mongoose.Schema({
	username:{
		type:String,
		required:true
	},
	fullName:{
		type: String,
		required: true
	},
	emailId:{
		type:String,
		required:true
	},
	phone:{
		type:String,
		required:true
	}
},{timestamps:true});

const User=module.exports=mongoose.model('User',UserSchema);

module.exports.getUserByID=function(id,callback){
	User.findById(id,callback);
};

module.exports.getUserByUsername=function(username,callback){
	query={username: username};
	User.findOne(query,callback);
};

module.exports.addUser=function(newUser,callback){
	newUser.save(callback);
};

module.exports.comparePassword=function(enteredPassword,hash,callback){
	bcrypt.compare(enteredPassword,hash,(err,isMatch)=>{
		if(err)
			throw(err);
		else
			callback(null,isMatch);
	});
};