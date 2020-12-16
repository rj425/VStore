// Importing required modules
const express=require('express');
const router=express.Router();
const passport=require('passport');


// Importing Item models
const Transaction=require('../models/transactionModel');

// Adding a new transaction
router.post('/postTransaction',passport.authenticate('jwt',{session:false}),(req,res,next)=>{
	let newTansaction=new Transaction({
		sellerID:req.body.sellerID,
		buyerID:req.body.buyerID,
		itemID:req.body.itemID
	});
	Transaction.addTransaction(newTansaction,(err,transaction)=>{
		if(!err)
			res.json({'success':true,'messsage':'Transaction added successfully.','transaction':transaction});
		else
			res.json({'success':false,'error':err})
	});
}); 
module.exports=router;