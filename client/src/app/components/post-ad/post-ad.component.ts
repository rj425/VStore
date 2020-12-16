import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray,FormControl,Validators } from '@angular/forms';
import * as _ from 'underscore';
import { AuthService } from '../../shared/services/auth.service';
import { VStoreService } from '../../shared/services/vStore.service';
import { CookieService } from 'angular2-cookie/core';
import { PageService } from '../../shared/services/page.service';
import { Router } from '@angular/router';
import { Config } from '../../shared/config/project.config';
import { MdSnackBar } from '@angular/material';


@Component({
  selector: 'app-post-ad',
  templateUrl: './post-ad.component.html',
  styleUrls: ['./post-ad.component.css']
})
export class PostAdComponent implements OnInit {

  productTags:any=[]
  tagsArray:any
  advertisementForm:any;
  saleOption:any=[{value:'sale',display:'For Sale'},{value:'rent',display:'For Rent'}];
  saleRent:any;
  filteredSearchTags:any
  imageBlobList:any=[];
  showProgressBar:boolean=false
  

  constructor(private authService:AuthService,
              private cookieService:CookieService,
              private pageService:PageService,
              private vstoreService:VStoreService,
              private router:Router,
              private snackBar:MdSnackBar)
  {  if(!this.authService.loggedIn()){
      this.pageService.setCurrentPage('postAd',null)
      this.router.navigate(['/login'])
  }
     this.vstoreService.get(Config.API+"/getTags")
                       .subscribe(res=>{this.tagsArray=res.json().result})
  }
  ngOnInit() {
  	this.advertisementForm = new FormGroup({  
      itemName:new FormControl('',[Validators.required,Validators.maxLength(15)]),
      price:  new FormControl('',[Validators.required,Validators.min(100),Validators.max(10000000)]),
      saleRent:new FormControl('',Validators.required),
      enteredTag:new FormControl('',Validators.max(15)),
	    descriptionPassage: new FormControl('',[Validators.required,Validators.max(500)]),
	    specifications: new FormArray([])	    
  	})
    this.filteredSearchTags=this.advertisementForm.controls['enteredTag'].valueChanges.map(value=>this.filterTags(value));
  }

  addPair(){
  	let newPair= new FormGroup({
  		key:new FormControl('',Validators.required),
  		value:new FormControl('',Validators.required)
  	})
  	this.advertisementForm.controls.specifications.push(newPair);
  }

  removePair(i:number){
  	this.advertisementForm.controls.specifications.removeAt(i);
  }

  addTag(tag){
    if(this.productTags<6)
      if(tag!==null)
        if(tag!=='' && tag.length<=10){        
          this.productTags.push(tag)
          this.advertisementForm.controls['enteredTag'].reset()
        }
  }

  removeTag(index){
    this.productTags.splice(index,1)
  }

  deleteLastTag(){
    if(this.advertisementForm.controls['enteredTag'].value===null)
      this.productTags.pop()
    else{
      if(this.advertisementForm.controls['enteredTag'].value.length==0)
        this.advertisementForm.controls['enteredTag'].setValue(null)
    }
  }
  
  filterTags(value:string){
    return value?this.tagsArray.filter((element)=>element['tag'].indexOf(value.toLowerCase())===0):null
  }

  imageUploaded(event){
    console.log(event)
    let alreadySelected: boolean = false
    for(var i=0;i<this.imageBlobList.length;i++) {
      if(this.imageBlobList[i][0] == event.file.name) {
        alreadySelected = true
      }
    }
    if(!alreadySelected) {
      this.imageBlobList.push([event.file.name,event.src])
    }
  }

  imageRemoved(event){
    for(var i=0;i<this.imageBlobList.length;i++) {
      if(this.imageBlobList[i][0] == event.file.name) {
        this.imageBlobList.splice(i,1);
      }
    }
  }

  onSubmit(){
      this.showProgressBar=true
      this.advertisementForm.disable()
      if(this.advertisementForm.value['saleRent']!==undefined)
      {
          //Avoiding mulitple values of sale or rent tag
          for(let i=0;i<this.productTags.length;i++){
            if(this.productTags[i]=='sale' || this.productTags[i]=='rent')
              this.productTags.splice(i,1)
          }
          this.productTags.push(this.advertisementForm.value['saleRent'])
      }
      let postBody={
        sellerID:this.cookieService.getObject('user')['username'],
        sellerEmail:this.cookieService.getObject('user')['emailId'],
        sellerName:this.cookieService.getObject('user')['fullName'],
        sellerContact:this.cookieService.getObject('user')['phone'],
        itemName:this.advertisementForm.value.itemName,
        description:{
          imagesURL:this.imageBlobList,
          price:this.advertisementForm.value.price,
          descriptionPassage:this.advertisementForm.value.descriptionPassage
        },
        specifications:this.advertisementForm.value.specifications,
        tags:this.productTags
      }
      console.log(postBody)
      this.vstoreService.post(Config.API+'/postItem',postBody)
                        .subscribe(res=>{
                                    if(res.status==201 && res.json().success==true){
                                      this.snackBar.open('Your Ad has been posted.',res.json().item.sellerName,{duration:3000});
                                      this.sendMail();
                                      this.advertisementForm.reset();
                                      this.router.navigate(['/dashboard']);
                                      this.showProgressBar=false
                                    }
                                  },err=>{
                                      this.advertisementForm.enable()
                                      this.snackBar.open('Something Went Wrong.','FAILED',{duration:3000});
                                      this.showProgressBar=false
                                  })

  }


  sendMail(){
    console.log('.')
    let emailObject={
      type:'postAd',
      itemName:this.advertisementForm.value.itemName,
      price:this.advertisementForm.value.price,
      link:'',
      seller:{
        email:this.cookieService.getObject('user')['emailId'],
        name:this.cookieService.getObject('user')['fullName'],
        contact:this.cookieService.getObject('user')['phone']
        }
    }
    this.vstoreService.post(Config.API+'/emailUser',emailObject)
                      .subscribe(res=>{
                        console.log(emailObject);
                        console.log("Response:"+res);

                      })

  }

}
