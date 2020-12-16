import { Component, OnInit } from '@angular/core';
import { CookieService } from 'angular2-cookie/core';
import { Router } from '@angular/router';
import { MdSnackBar } from '@angular/material';
import { AuthService } from '../../shared/services/auth.service';
import { VStoreService } from '../../shared/services/vStore.service';
import { FormControl } from '@angular/forms';


import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

	private user:any
	loginStatus:boolean=null

	constructor(public vstoreService:VStoreService,
				public cookieService:CookieService,
				private router:Router,
				private mdSnackBar:MdSnackBar,
				public authService:AuthService)
	{}

	ngOnInit(){}

	gotToDashBoard(){
		this.router.navigate(['/dashboard'])
	}

	getUserInformation(){
		if (this.authService.loggedIn())
			this.user=this.cookieService.getObject('user')
	}

	logout(){
		this.cookieService.remove('token');
		this.cookieService.remove('user');
		this.mdSnackBar.open('Bye, '+this.user.fullName,'LOGGED OUT',{duration:3000})
		this.router.navigate(['/']);
	}
}
