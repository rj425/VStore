import { Component, OnInit } from '@angular/core';
import { FormGroup,FormControl,Validators } from '@angular/forms';
import { MdSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { VStoreService } from '../../shared/services/vStore.service'
import { PageService } from '../../shared/services/page.service'
import { CookieService } from 'angular2-cookie/core';
import { Config } from '../../shared/config/project.config';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

	loginForm:FormGroup;
	showProgressBar:boolean=false
	

	constructor(private vStoreService:VStoreService,private pageService:PageService,private cookieService:CookieService,private snackBar:MdSnackBar,private router:Router){
		this.loginForm=new FormGroup({
			username:new FormControl('',Validators.required),
			password:new FormControl('',Validators.required),
		});
		
	}

	ngOnInit(){}

	login(){
		this.loginForm.disable()
		this.showProgressBar=true
		this.vStoreService.post(Config.API+'/user/authenticate',this.loginForm.value)
				  .subscribe(res=>{
				  				console.log(res)
							  	if(res.status==200){
									if(res.json().success==true){
								  		this.snackBar.open('Welcome to VStore!',res.json().user.fullName,{duration:3000});
								  		this.redirectTo();
								  		this.storeTokenAndUser(res.json().token,res.json().user);
							  		}
							  	}
							  	this.showProgressBar=false
							  },
							  err=>{
							 	this.loginForm.enable()
							  	if(err.status==401)
							  		this.snackBar.open(err.json().message,'FAILED',{duration:3000});
							  	else if(err.status==503)
							  		this.snackBar.open('Please connect to Corporate network.','Thank You.',{duration:3000});							  		
							  	else
							  		this.snackBar.open('Server is down! Please try later.','Thank You.',{duration:3000});
							  	this.showProgressBar=false
							  	}
							  )
	}

	redirectTo(){
		if(this.pageService.getLastAccessedPage()==='postAd')
			this.router.navigate(['/postAd'])
		else if(this.pageService.getLastAccessedPage()==='adDetails'){
			console.log("itemID "+this.pageService.itemID)
			this.router.navigate(['/adDetails/'+this.pageService.itemID])
		}else
			this.router.navigate(['/dashboard'])
	}

	storeTokenAndUser(token,user){
		this.cookieService.put('token',token);
		this.cookieService.putObject('user',user);
	}
}
