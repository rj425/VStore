const JwtStrategy=require('passport-jwt').Strategy;
const ExtractJwt=require('passport-jwt').ExtractJwt;
const User=require('../models/userModel');
const config=require('./database');

// Every protected route receiving requests has to go through this function before actual route.
module.exports=function(passport){
	let options={};
	options.jwtFromRequest=ExtractJwt.fromAuthHeaderAsBearerToken();
	options.secretOrKey=config.secret;
	passport.use(new JwtStrategy(options,(jwt_payload,done)=>{
		User.getUserByID(jwt_payload._doc._id,(err,user)=>{
			if (err)
				return done(err,false);
			if(user)
				return done(null,user);
			else
				return done(null,false);
		});
	}));
};