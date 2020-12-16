import { Component, OnInit, Input,Inject } from '@angular/core';
import { Config } from '../../shared/config/project.config';
import { MdDialog } from '@angular/material';
import { Router } from '@angular/router';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css']
})
export class ItemComponent implements OnInit {

	API=Config.API

	@Input() item:any=null
	@Input() imageHeight:any=null
	@Input() imageWidth:any=null

	constructor(private mdDialog:MdDialog,private router:Router) { }

	ngOnInit() {
	}

	goToItemDetailsPage(event,itemID:any){
		this.router.navigate(['adDetails',itemID])
	}
}
