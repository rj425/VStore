// Importing Required Modules
const express=require('express');
const router=express.Router();
const passport=require('passport');


// Importing Tag Model
const Tag=require('../models/tagModel');

// Listing all the tags
router.get('/getTags',(req,res,next)=>{
	Tag.getAllTags((err,tags)=>{
		if(!err)
			res.json({'success':true,'length':tags.length,'result':tags});
		else
			res.json(err);
	});
});

module.exports=router;