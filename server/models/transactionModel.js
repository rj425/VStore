// Importing Requried Modules
const mongoose=require('mongoose');
const item=require('./itemModel')

// Transaction Schema
const TransactionSchema=mongoose.Schema({
	sellerID:{
		type:String,
		required:true,
		lowercase:true
	},
	buyerID:{
		type:String,
		required:true,
		lowercase:true
	},
	itemID:{
		type:mongoose.Schema.Types.ObjectId,
		ref:'item',
		required:true
	}
},{timestamps:true});

const Transaction=module.exports=mongoose.model('Transaction',TransactionSchema);

module.exports.addTransaction=function(newTransaction,callback){
	newTransaction.save(callback);
};