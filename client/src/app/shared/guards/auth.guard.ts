import { Injectable } from '@angular/core';
import { Router,CanActivate} from '@angular/router';
import { AuthService } from '../services/auth.service';

// Guards the URLs when user is logged out.
@Injectable()
export class IsLoggedOutGuard implements CanActivate{

	constructor(private authService:AuthService,private router:Router){}

	canActivate():boolean{
		if(this.authService.loggedIn()){
			return true;
		}
		else{
			this.router.navigate(['/login']);
			return false;
		}
	}
}

// Guards the URLs when user is logged in.
@Injectable()
export class IsLoggedInGuard implements CanActivate{

	constructor(private authService:AuthService,private router:Router){}

	canActivate():boolean{
		if(this.authService.loggedIn()){
			this.router.navigate(['/dashboard']);
			return false;
		}
		else{
			return true;
		}
	}

}