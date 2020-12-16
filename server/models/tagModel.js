// Importing Required Modules
const mongoose=require('mongoose');

// Tag Schema
const TagSchema=mongoose.Schema({
	tag:{
		type:String,
		unique:true,
		required:true
	}
},{timestamps:true});

const Tag=module.exports=mongoose.model('Tag',TagSchema);

module.exports.getAllTags=function(callback){
	Tag.find(callback)
};