// Importing requireed Modules
const express=require('express');
const router=express.Router();
const passport=require('passport');
const fs = require('fs');
const moment = require('moment');
const nodemailer = require('nodemailer');

// Importing Item Model
const Item=require('../models/itemModel');
const Transaction = require('../models/transactionModel');

// Adding a new Item
router.post('/postItem',passport.authenticate('jwt',{session:false}),(req,res,next)=>{
	let imagesURL = []
	var imageDir='./public'
	if (!fs.existsSync(imageDir))
		fs.mkdirSync(imageDir)
	imageDir=imageDir+'/itemImages'
	if(!fs.existsSync(imageDir))
		fs.mkdirSync(imageDir)
	let userImageDir = imageDir+'/'+req.body.sellerID
	if (!fs.existsSync(userImageDir)) {
		fs.mkdirSync(userImageDir)
	}
	var time = moment();
	var timeFormat = time.format('YYYY-MM-DD HH:MM:SS').toString();
	timeFormat = timeFormat.replace(/:/g,'-')
	timeFormat = timeFormat.replace(/ /g,'_')
	timeImageDir = userImageDir+'/'+timeFormat
	if (!fs.existsSync(timeImageDir)) {
		fs.mkdirSync(timeImageDir)
	}
	imageBlobList = req.body.description.imagesURL
	for(var i=0;i<imageBlobList.length;i++) {
		var fileName = timeImageDir+'/'+imageBlobList[i][0]
		var decodeBlobImage = new Buffer (imageBlobList[i][1],'base64')
		imagesURL.push(fileName);
		dataBlob = imageBlobList[i][1].replace(' ','')
		var blobImage = dataBlob.split(',')
		// Converting Base 64 file to binary file
		binaryImage = new Buffer(blobImage[1], 'base64');		
		fs.writeFile(fileName,binaryImage,function(err){
			if(err) {
				return res.json({'success':false,'error':err});
			}
		});
	}
	req.body.description.imagesURL = imagesURL
	// Making all the tags into lowercase
	for(let i=0;i<req.body.tags.length;i++){
		req.body.tags[i]=req.body.tags[i].toLowerCase();
	}
	let descriptionNew = {
		imagesURL:imagesURL,
        price:req.body.description.price,
        descriptionPassage:req.body.description.descriptionPassage
	}
	let newItem=new Item({
		sellerID:req.body.sellerID,
		sellerEmail:req.body.sellerEmail,
		sellerName:req.body.sellerName,
		sellerContact:req.body.sellerContact,
		itemName:req.body.itemName,
		description:descriptionNew,
		specifications:req.body.specifications,
		tags:req.body.tags,
		soldOut:false
	});
	Item.addItem(newItem,(err,item)=>{
		if(!err){
			res.status(201)
			res.json({'success':true,'message':'Item added successfully.','item':newItem});
		}
		else{
			res.status(400)
			res.json({'success':false,'error':err});
		}
	});
});

router.put('/editItems/:itemID',passport.authenticate('jwt',{session:false}),(req, res,next)=>{
	itemID = req.params.itemID
	username = req.user.username
	newBody=req.body
	Item.editItemByID(itemID,newBody,(err)=>{
		if (err)
			res.send({'success':false,'error':err})
		if(req.body['soldOut']===true) {
			buyerID = req.body.buyer.buyerID
			let newTransaction = new Transaction({
				sellerID:username,
				buyerID:buyerID,
				itemID:itemID
			});
			Transaction.addTransaction(newTransaction,(err)=>{
				if (err)
					res.send({'success':false, 'error':err})
			});
		}
		res.status(200)
		res.send({'success':true})
	});
});


router.get('/getItems/:itemID',(req,res,next)=>{
	itemID=req.params.itemID
	Item.getItemByID(itemID,(err,items)=>{
		if(!err)
			res.json({'success':true,'length':items.length,'result':items});
		else
			res.json(err);
	})
});

// Listing all the items
router.get('/getItems',(req,res,next)=>{
	Item.getAllItems((err,items)=>{
		if(!err)
			res.json({'success':true,'length':items.length,'result':items});
		else
			res.json(err);
	})
});

// List items by tag filter
router.post('/getFilteredItems',(req,res,next)=>{
	let tags=req.body.tags;
	Item.getFilteredItems(tags,(err,items)=>{
		if(!err)
			res.json({'success':true,'length':items.length,'result':items});
		else
			res.json(err);
	})
})

// Listing the recent items
router.get('/getRecentItems',(req,res,next)=>{
	Item.getRecentItems(req.user['username'],(err,items)=>{
		if(req.user){
			var username=req.user['username']
		}else{
			var username=null;
		}
	});	
})

// Listing user posted ads
router.get('/getUserItems',passport.authenticate('jwt',{session:false}),(req,res,next)=>{
	Item.getUserItems(req.user.username,(err,items)=>{
		if(!err)
			res.json({'success':true,'length':items.length,'result':items});
		else
			res.json(err);		
	})
})

module.exports=router