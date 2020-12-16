const express=require('express');
const router=express.Router();
const nodemailer = require('nodemailer');
const event = require('events');
const passport=require('passport');

const User=require('../models/userModel');

const helper = require('sendgrid').mail;

const sg = require('sendgrid')('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');

const eventEmitter = new event.EventEmitter();

var sendEmailHandler = function sendEmail(mailOptions, res) {
	sg.API(mailOptions, function (error, response) {
		if (error) {
			return false			
		}
		return true
	});
}

eventEmitter.on('send', sendEmailHandler);

var emailDataHandler = function emailData(fromMail, toMail, subjectMail, content, res) {
	var mail = new helper.Mail(fromMail, subjectMail, toMail, content);
	var mailOptions = sg.emptyRequest({
	  method: 'POST',
	  path: '/v3/mail/send',
	  body: mail.toJSON()
	});
	sendEmailHandlerOutput = eventEmitter.emit('send', mailOptions, res)
	return sendEmailHandler
}

eventEmitter.on('emailData', emailDataHandler);

router.post('/emailUser',passport.authenticate('jwt',{session:false}),(req,res,next)=>{
	// {
	//  type: 'postAd/buy'
	// 	itemName : '',
	// 	price : '',
	// 	link : '',
	// 	seller : {
	// 		email:'',
	// 		name:'',
	// },
	// 	buyer: {
	// 		email:'',
	// 		name:'',
	// 		contactNumber:''
	// 	}
	// }
	var fromEmail = new helper.Email('TeamVStore@sendgrid.com');
	if (req.body.type == 'postAd') {
		var toEmail = new helper.Email(req.body.seller.email);
		var subject = 'New advertisment created';
		htmlMail = '<br>Item Name : '+req.body.itemName+'<br>Price : '+req.body.price+
						'<br><a href='+req.body.link+'> See your product </a><br>'
		var content = new helper.Content('text/html',htmlMail);
		success = eventEmitter.emit('emailData', fromEmail, toEmail, subject, content, res)
		if (success) {
			res.send({'success':true,'message':'Mail sent successfully.'});
		}else {
			res.send({'success':false,'error':error});
		}
	}else if(req.body.type == 'buy') {

		// var toSellerEmail = new helper.Email(req.body.seller.email);
		// var sellerPhone;
		// User.getUserByUsername(req.body.seller.id, (err,sellerDetails)=>{
		// 	if (err) {
		// 		res.send({'success':false,'error':err});
		// 	} else {
		// 		sellerPhone = sellerDetails.phone
		// 	}
		// });
		var toSellerEmail=new helper.Email(req.body.seller.email);
		var subjectSeller = 'Potential buyer for '+req.body.itemName;
		var toBuyerEmail = new helper.Email(req.body.buyer.email);
		var subjectBuyer = 'Seller details for '+req.body.itemName;
		htmlContentSeller = '<br>Item Name : '+req.body.itemName+'<br> \
							Price : '+req.body.price+'<br> \
							<a href='+req.body.link+'> See your product </a><br> \
							Buyer Name : '+req.body.buyer.name+'<br> \
							Buyer Email : '+req.body.buyer.email+'<br> \
							Buyer\'s Contact Number : '+req.body.buyer.contactNumber+'<br>'
		htmlContentBuyer = '<br>Item Name : '+req.body.itemName+'<br> \
		Price : '+req.body.price+
						'<br><a href='+req.body.link+'> See the product </a><br>Seller Name : '+
						req.body.seller.name+'<br>Seller Email : '+req.body.seller.email+
						'<br>Seller\'s Contact Number : '+req.body.seller.contactNumber+'<br>'
		var contentSeller = new helper.Content('text/html',htmlContentSeller);
		var contentBuyer = new helper.Content('text/html',htmlContentBuyer);
		successSeller = eventEmitter.emit('emailData', fromEmail, toSellerEmail, subjectSeller,	contentSeller, res)
		successBuyer = eventEmitter.emit('emailData', fromEmail, toBuyerEmail, subjectBuyer, contentBuyer, res)
		if (successBuyer && successSeller) {
			console.log(toSellerEmail)
			console.log(toBuyerEmail)
			res.send({'success':true,'message':'Mail sent successfully.'});
		}else {
			res.send({'success':false,'error':error});
		}
	}
});


module.exports=router