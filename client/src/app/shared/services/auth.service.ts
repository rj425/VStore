import { Injectable } from '@angular/core';
import { Http,Headers } from '@angular/http';
import { tokenNotExpired } from 'angular2-jwt';
import { CookieService } from 'angular2-cookie/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';


@Injectable()
export class AuthService {

	authToken:any;
	user:any;

  	constructor(private http:Http,private cookieService:CookieService){}

  	// The tokenNotExpired function can be used to check whether a JWT exists in local storage, 
  	// and if it does, whether it has expired or not. If the token is valid, tokenNotExpired returns true, 
  	// otherwise it returns false.
  	loggedIn(){
  		return (tokenNotExpired(undefined,this.cookieService.get('token')));
  	}

}
