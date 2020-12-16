import { Component, OnInit } from '@angular/core';
import { UpperCasePipe } from '@angular/common';
import { AuthService } from '../../shared/services/auth.service';
import { VStoreService } from '../../shared/services/vStore.service';
import { CookieService } from 'angular2-cookie/core';
import { PageService } from '../../shared/services/page.service';
import { Router,ActivatedRoute } from '@angular/router';
import { Config } from '../../shared/config/project.config';
import { DomSanitizer } from '@angular/platform-browser';
import { MdSnackBar } from '@angular/material';


@Component({
  selector: 'app-ad-details',
  templateUrl: './ad-details.component.html',
  styleUrls: ['./ad-details.component.css'],

})
export class AdDetailsComponent implements OnInit {

  imageLoad:boolean=false;
  Jresponse:any=[];
  adID:any;
  images:any=[];
  API=Config.API
  url:any;
  state: string = 'small';
  product:any={}
  buttonName:String;
  sellProduct=false;
  selectedBuyer:any;
  buttonReady:any=false;
  disableButton:any=false;
  isLoggedIn:any=false;
  user:any

  config: any = {
    pagination: '.swiper-pagination',
    paginationClickable: true,
    nextButton: '.swiper-button-next',
    prevButton: '.swiper-button-prev',
    spaceBetween: 50,
    slidesPerView:1,
    centeredSlides:true
  };

  constructor(private authService:AuthService,
              private vstoreService:VStoreService,
              private cookieService:CookieService,
              private pageService:PageService,
              private router:Router,
              private route:ActivatedRoute,
              private snackBar:MdSnackBar){}

  ngOnInit(){
    this.pageService.setCurrentPage('adDetails',null)
    if(this.authService.loggedIn())
      this.isLoggedIn=true;
  	this.route.params.map(params=>params['adID'])
                    .subscribe(adID=>{
                        this.adID=adID;
                        this.vstoreService.get(Config.API+'/getItems/'+this.adID)
                                          .subscribe(res=>{
                                                          this.Jresponse=res.json().result;
                                                          this.pageService.setCurrentPage('adDetails',this.Jresponse._id)
                                                          this.images=this.Jresponse.description.imagesURL;
                                                          this.checkUser();
                                                          this.buildDetails();
                                                    })
                    })
  }

  checkUser(){
    if(this.isLoggedIn){
      this.user=this.cookieService.getObject('user');
      console.log("user"+this.user)
      if(this.Jresponse.sellerID===this.user['username']){
        if(this.Jresponse.soldOut===true){
          this.buttonName='Sold';
          this.disableButton=true;
        }else{
          this.buttonName='Mark as Sold';
        }
      }else{
        for(let i=0;i<this.Jresponse.interestedBuyers.length;i++){
          var existingBuyer=this.Jresponse.interestedBuyers[i]
          if(existingBuyer['buyerID']==this.user['username']){
            this.disableButton=true;
            break;
          }
        }
        this.buttonName='Express Interest';  
      }
    }else{
      this.buttonName='Express Interest'; 
    }
    this.buttonReady=true;
  }

  buildDetails(){
    if(this.Jresponse.specifications.length!=0){
      var spec=this.Jresponse.specifications
    }else
      var spec=null;
    this.product={
      name:this.Jresponse.itemName,
      price:this.Jresponse.description.price,
      tags:this.Jresponse.tags,
      interestedBuyers:this.Jresponse.interestedBuyers,
      specfications:spec,
      description:this.Jresponse.description.descriptionPassage?this.Jresponse.description.descriptionPassage:'',
    }
    if(this.buttonName!=='Express Interest'){
      this.product['interestedBuyers'].push({ buyerID:"Not On VStore",
                                              buyerName:"Not On VStore",
                                              buyerEmailId:"Not On VStore",
                                              buyerPhone:"Not On VStore"})
    }
  }

  handleButtonEvent(){
    if(this.buttonName=='Mark as Sold'){
        this.sellProduct=true;
    }else{
      //handle redirection to login
      if(!this.isLoggedIn){
        //sending itemID
        this.pageService.setCurrentPage('adDetails',this.Jresponse._id)
        this.router.navigate(['/login']);

      }else{
        var newBuyer= 
            { 
                buyerID:this.user['username'],
                buyerName:this.user['fullName'],
                buyerEmailId:this.user['emailId'],
                buyerPhone:this.user['phone']
            }
        this.Jresponse.interestedBuyers.push(newBuyer);
        var newDoc={interestedBuyers:this.Jresponse.interestedBuyers}
        this.vstoreService.put(Config.API+'/editItems/'+this.adID,newDoc)
                          .subscribe(res=>{
                            if(res.status===200){
                                 this.disableButton=true
                                 this.snackBar.open('You will be contacted shortly by seller.',this.user['fullName'],{duration:3000});  
                               }
                          },err=>{
                            this.snackBar.open('Something went wrong',this.user['fullName'],{duration:3000});
                          })

        var emailBody={  type: 'buy',
                      itemName : this.Jresponse.itemName,
                      price : this.Jresponse.description.price,
                      link : this.router.url+'/adDetails/'+this.Jresponse._id,
                      seller : {
                        email:this.Jresponse.sellerEmail,
                        name:this.Jresponse.sellerName,
                        contactNumber:this.Jresponse.sellerContact
                      },
                      buyer: {
                        email:this.user['emailId'],
                        name:this.user['fullName'],
                        contactNumber:this.user['phone']
                      }
                    }
                    console.log('emailBody:'+emailBody)

          this.vstoreService.post(Config.API+'/emailUser',emailBody)
                            .subscribe(res=>{console.log(res);console.log(emailBody)},err=>(console.log(err)))
          //put request- add user to interested buyers[]
          //email to buyer & seller
      }

    }
  }

  addTransaction(){
    if(this.selectedBuyer===undefined)
      this.snackBar.open('Please select a buyer.',this.user['fullName'],{duration:3000});
    else{
      var newDoc={
                  soldOut:true,
                  buyer:this.selectedBuyer
                }
      this.vstoreService.put(Config.API+'/editItems/'+this.adID,newDoc)
                         .subscribe(res=>{
                            if(res.status===200){
                               this.buttonName="Sold"
                               this.disableButton=true
                               this.sellProduct=false
                               this.snackBar.open('Thank You for using VStore.',this.user['fullName'],{duration:3000});  
                             }
                         },err=>{
                           this.snackBar.open('Something went wrong',this.user['fullName'],{duration:3000});
                         })
    }
  }




}


