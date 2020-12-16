import { Injectable } from '@angular/core';
import { Http,Response,Headers,RequestOptions,URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { CookieService } from 'angular2-cookie/core';

@Injectable()
export class VStoreService{

	private dataSource=new BehaviorSubject<any>(null);
	data=this.dataSource.asObservable();

	constructor(private http:Http, private cookieService:CookieService){}

	sendData(data:any){
		this.dataSource.next(data)
	}

	getToken(){
		let token=this.cookieService.get('token')
		return token
	}

	createAuthorizationHeader(){
		let headers:Headers=new Headers({'Content-Type':'application/json'});
		let token=this.getToken()
		if(token!==undefined)
			headers.append('Authorization',token)
		return headers	
	}

	get(url:string,searchParams?:URLSearchParams):Observable<Response>{
		let options:RequestOptions=null
		options=new RequestOptions({headers:this.createAuthorizationHeader(),search:searchParams});
		return this.http.get(url,options)
	}

	post(url:string,body:any,searchParams?:URLSearchParams):Observable<Response>{
		let options:RequestOptions=null
		options=new RequestOptions({headers:this.createAuthorizationHeader(),search:searchParams});
		return this.http.post(url,body,options)
	}

	 put(url:string,body:any,searchParams?:URLSearchParams):Observable<Response>{
	    let options:RequestOptions=null
    	options=new RequestOptions({headers:this.createAuthorizationHeader(),search:searchParams}); 
	    return this.http.put(url,body,options)
                    
  }



}