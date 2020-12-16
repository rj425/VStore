import { Component, OnInit, Input, Directive, ElementRef } from '@angular/core';
import { FormControl,Validators} from '@angular/forms';
import { AuthService } from '../../../shared/services/auth.service';
import { VStoreService } from '../../../shared/services/vStore.service';
import { Router,NavigationEnd } from '@angular/router';
import { URLSearchParams } from '@angular/http';
import { Config } from '../../../shared/config/project.config';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit{

	deleteFlag:number=0
	visibility:any=true
	filteredSearchTags:any;
	searchTags:any=[]
	searchSuggestions:any=[]
	enteredTag:FormControl;
	@Input() public currentURL:string
	@Input() tag=null

	constructor(private authService:AuthService,private vstoreService:VStoreService,private router:Router)
	{
		this.router.events.subscribe((event)=>{
			console.log(event['url'])
			if((event['url']==='/dashboard' || event['url']==='/' )){
				this.visibility=true
				this.vstoreService.get(Config.API+"/getTags")
						  			.subscribe(res=>{this.searchSuggestions=res.json().result})
		}
			else{
				this.visibility=false
			}
		});
		this.enteredTag=new FormControl(null,Validators.required);
		this.filteredSearchTags=this.enteredTag.valueChanges.map(value=>this.filterTags(value));
	}

	ngOnInit(){
	}

	addTag(tag){
	if(this.searchTags.length<6)
		if(tag!==null)
		  if(tag!=='' && tag.length<=10){        
		    this.searchTags.push(tag)
		  }
		this.enteredTag.reset()
		this.searchItems()
	}

	removeTag(index){
		this.searchTags.splice(index,1)
		this.searchItems()
	}

	deleteLastTag(){
		if(this.enteredTag.value===null){
			this.searchTags.pop()
			this.searchItems()
		}
		else{
			if(this.enteredTag.value.length==0)
				this.enteredTag.setValue(null)
		}
	}

	filterTags(value:string){
			return value?this.searchSuggestions.filter((element)=>element['tag'].indexOf(value.toLowerCase())===0):null
	}

	searchItems(){
		this.vstoreService.sendData(this.searchTags)
	}
}
