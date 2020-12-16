import { Injectable } from '@angular/core';

@Injectable()
export class PageService {

  pageName:any='dashboard'
  itemID:any=null;
  constructor() { }

  setCurrentPage(page:String,id:any){
  	this.pageName=page;
  	if(this.pageName==='adDetails')
  		this.itemID=id;
    else
      this.itemID=null
  }

  getLastAccessedPage(){
  	return this.pageName
  }

}
