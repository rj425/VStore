// Importing Required Modules
const express=require('express');
const router=express.Router();
const passport=require('passport');
const jwt=require('jsonwebtoken');
const config=require('../config/database');

// Required for making POST Request
const request=require('request');

// Importing User Model
const User=require('../models/userModel');

// Authenticating user
router.post('/authenticate/',(req,res,next)=>{
	authenticateFromLDAP(req.body.username,req.body.password,(err,result,statusCode)=>{
		// User is Authenticated
		if(!err && statusCode==200)
		{
			result=JSON.parse(result)
			// Checking if the user has logged in for the first time into VSTORE by 
			// checking the user document in user collection
			User.getUserByUsername(req.body.username,(err,existingUser)=>{
				// If there is no user, add one.
				if(err==null && existingUser==null)
				{
					let newUser=new User({
						username:req.body.username,
						fullName:result.details.fullName,
						emailId:result.details.emailID,
						phone:result.details.phone
					});
					User.addUser(newUser,(err,addedUser)=>{
						if(err){
							res.status(500)
							res.json({'success':false,'err':err})
							throw(err)
						}
						else{
							let token=assignToken(addedUser)
							res.status(200)
							return res.json({'success':true,'token':'Bearer '+token,'user':addedUser})
						}
					})
				}					
				// If user is already existing
				else{
					let token=assignToken(existingUser)
					res.status(200)
					return res.json({'success':true,'token':'Bearer '+token,'user':existingUser});
				}
			});
		}
		// User not Authorized
		else if(!err && statusCode==401){
			res.status(401)
			return res.json({'success':false,'message':'User Not Authorized.'});
		}
		// If server is unavilable
		else if(statusCode==503)
		{
			res.status(503)
			return res.json({'success':false,err})
		}
		// Interval Server Error
		else{
			res.status(500)
			return res.json({'success':false,'message':err})
		}
	});
});

function assignToken(user){
	const token=jwt.sign(user,config.secret,{
					expiresIn:604800
				})
	return token
}

function authenticateFromLDAP(username,password,callback){
	//Configuring the request
	let requestOptions={
		url:'http://10.137.89.7:3005/login',
		method:'POST',
		form:{
			'username':username,
			'password':password
		}
	}
	// Sending POST Request to LDAP login API
	request(requestOptions,(error,response,body)=>{
		if(response!==undefined)
			callback(error,body,response.statusCode);
		else{
			callback(error,body,503)
		}
	})
}
module.exports=router