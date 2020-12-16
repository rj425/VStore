// Importing Required Modules
const mongoose=require('mongoose');
const Tag=require('./tagModel');
// const User=require('./userModel')

// Interested Buyer Schema (Sub Document of Item Document)
const InterestedBuyerSchema=mongoose.Schema({
	buyerID:{
		type:String,
		required:true,
		lowercase:true
	},
	buyerName:{
		type:String,
		required:true
	},
	buyerEmailId:{
		type:String,
		required:true
	},
	buyerPhone:{
		type:String,
		required:true
	}
});

// Item Description Schema
const DescriptionSchema=mongoose.Schema({
	imagesURL:{
		type:[String]
	},
	thumbnailImageURL:{
		type:String
	},
	price:{
		type:Number,
		required:true
	},
	descriptionPassage:{
		type:String,
		requried:true
	}
});

// Item Schema
const ItemSchema=mongoose.Schema({
	sellerID:{
		type:String,
		required:true,
		lowercase:true
	},
	sellerEmail:{
		type:String,
		required:true
	},
	sellerName:{
		type:String,
		required:true
	},
	sellerContact:{
		type:String,
		required:true
	},
	itemName:{
		type:String,
		required:true
	},		
	description:DescriptionSchema,
	specifications:{
		type:Object
	},
	tags:{
		type:[String],
		requried:true
	},
	interestedBuyers:[InterestedBuyerSchema],
	soldOut:{
		type:Boolean,
		required:true,
		default: false
	}
},{timestamps:true});

const Item=module.exports=mongoose.model('Item',ItemSchema);

module.exports.addItem=function(newItem,callback){
	newItem.save(callback).then((item)=>{
		// Updating tags collection
		item.tags.forEach(function(enteredTag){
			// Checking if the tag is a new tag, store it.
			Tag.find({tag:enteredTag.toLowerCase()},(err,tag)=>{
				if(tag.length===0){
					let newTag=new Tag({
						tag:enteredTag.toLowerCase()
					});
					newTag.save(); 
				}
			});
		});
	});
};

module.exports.getAllItems=function(callback){
	Item.find(callback)
};

module.exports.getItemByID=function(objectID,callback){
	// Item.findOne(callback).where("objectID").in('_id')
	query={_id: objectID};
	Item.findOne(query,callback);
}

module.exports.getFilteredItems=function(tags,callback){

	query={tags:{$in:tags},soldOut:false}
	Item.find(query,callback)
}

module.exports.getRecentItems=function(username,callback){
	// Returns all the ads posted today
	const now=new Date()
	const today=new Date(now.getFullYear(),now.getMonth(),now.getDate());
	if(username){
		query={createdAt:{$gte:today},sellerID:{$ne:username},soldOut:false}
	}else{
		query={createdAt:{$gte:today},soldOut:false}
	}
	
	Item.find(query,callback)
}

module.exports.editItemByID=function(itemID,newBody,callback){
	var query = {_id: itemID}
	var updatedDoc={$set:newBody}
	Item.updateOne(query,updatedDoc,callback) 
}

module.exports.getUserItems=function(username,callback){
	var query={sellerID:username}
	Item.find(query,callback)
}
