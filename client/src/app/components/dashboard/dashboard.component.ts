import { Component, OnInit,Inject } from '@angular/core';
import { Router,NavigationEnd } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser'
import { VStoreService } from '../../shared/services/vStore.service';
import { Config } from '../../shared/config/project.config';
import { AuthService } from '../../shared/services/auth.service';
import { PageService } from '../../shared/services/page.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

	allItems:any=[]
	filteredItems:any=[]
	recentItems:any=[]
	userPostedItems:any=[]
	isLoggedIn:any=false;
	tags:any=[]
	searchResultMessage:string=null
	recentAdMessage:string=null
	userAdMessage:string=null
	noItemMessage:string=null
	selectedTabIndex:number=0
	API=Config.API
	showProgressBar=false

	constructor(private router:Router,
				private vstoreService:VStoreService,
				private pageService:PageService,
				private authService:AuthService) {
	}

	ngOnInit(){
		this.pageService.setCurrentPage('dashboard',null)
		if(this.authService.loggedIn()){
			this.isLoggedIn=true
		}
		this.getItems()
		this.getFilteredItems()
		this.getRecentItems()
		this.getUserPostedAds()
	}

	getItems(){
			this.vstoreService.get(Config.API+'/getItems')
								  .subscribe(res=>{
								  	this.allItems=res.json().result
								  	if(this.allItems.length===0)
							  	 	this.noItemMessage="No Ads found!"
								  	else
							  	 	this.noItemMessage=null
								  })
	}

	getFilteredItems(){
		this.showProgressBar=true
		this.vstoreService.data.subscribe(tags=>{
			if(tags==undefined || tags==null || tags.length==0){
				this.selectedTabIndex=0
				this.tags=[]
				this.filteredItems=[]
			}
			else{
				this.tags=tags
				this.selectedTabIndex=2		
				console.log('Searching for '+this.tags)
				this.vstoreService.post(Config.API+'/getFilteredItems',{"tags":this.tags})
								  .subscribe(res=>{
								  	console.log("FILTERED ITEMS-",res.json().result)
								  	this.filteredItems=res.json().result
								  	this.checkForEnteredTags()
								  })
			}
			this.showProgressBar=false
		})
	}

	getRecentItems(){
		this.showProgressBar=true
		if(this.isLoggedIn){
			this.vstoreService.get(Config.API+'/getRecentItems')
				  .subscribe(res=>{
				  	 console.log('RECENT ITEMS-',res.json().result)
				  	 this.recentItems=res.json().result
				  	 if(this.recentItems.length===0)
				  	 	this.recentAdMessage="No Recent Items found!"
				  	 else
				  	 	this.recentAdMessage=null
				  	 this.showProgressBar=false
				  })
		}else{
			this.showProgressBar=false
		}

	}

	getUserPostedAds(){
		this.showProgressBar=true
		if(this.isLoggedIn){
			this.vstoreService.get(Config.API+'/getUserItems')
						  .subscribe(res=>{
						  	 console.log('USER POSTED ITEMS-',res.json().result)
						  	 this.userPostedItems=res.json().result
						  	 if(this.userPostedItems.length===0)
						  	 	this.userAdMessage="No Ads are posted by you."
						  	 else
						  	 	this.userAdMessage=null
						  	 this.showProgressBar=false
						  })
		}else{
			this.showProgressBar=false
		}	
	}

	goToPostAd(){
		this.router.navigate(['postAd'])
	}

	checkForEnteredTags(){
		if(this.tags.length==0)
			this.searchResultMessage="No tags added for the search!"
		else if(this.tags.length!==0 && this.filteredItems.length==0)
			this.searchResultMessage="No results found!"
		else
			this.searchResultMessage=null
	}
}
