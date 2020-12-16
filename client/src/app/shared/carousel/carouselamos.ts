import { CommonModule } from '@angular/common';  
import {
  NgModule,
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,ViewChild,ElementRef
} from '@angular/core';
import isEqual from 'lodash.isequal';

@Component({
    selector: '[ng2-carouselamos]',
    templateUrl: './carouselamos.html',
    styleUrls:['./carouselamos.css']
})
/*
  *
  * @param() items - List of items to belong in carousel
  * @param() width - Size of window(view) to show
  * @param() $prev - Template for previous button
  * @param() $next - Template for next button
  * @param() $item - Template for the item
*/
export class Ng2Carouselamos{
  @Input() items = [];
  @Input() width = 80;
  @Input() $prev;
  @Input() $next;
  @Input() $item;
  @Output() onSelectedItem: EventEmitter<any> = new EventEmitter();
  @ViewChild('list')el:ElementRef
  childIndex: number = 0;
  amount: number = 0;
  startPress: number = 0;
  lastX: number = 0;
  disableNext=false
  
  onMousemove(e: MouseEvent, maxWidth: number,minWidth:number){
    if (e.which === 1) {
      const amount = this.lastX - (this.startPress - e.clientX);
      if (amount > 0 || amount < -(maxWidth-minWidth)) return;
      this.amount = amount;
    }
  }

  onMouseup(e: MouseEvent, elem){
    if (e.which === 1) {
      this.startPress = 0;
      //this.snap(elem);
    }
  }

  onMousedown(e: MouseEvent){
    if (e.which === 1) {
      this.startPress = e.clientX;
      this.lastX = this.amount;
    }
  }

  // Fits the item into wrapper irrespective if it semiappears on wrapper
  snap(elem){
    console.log('CAROUSEL IS SNAPPING')
    let counter = 0;
    let lastVal = 0;
    for (let i = 0; i < this.items.length; i++) {
      const el = elem.children[i];
      const style = el.currentStyle || window.getComputedStyle(el);
      counter += el.offsetWidth + (parseFloat(style.marginLeft) + parseFloat(style.marginRight));
      if (this.amount <= lastVal && this.amount >= -counter ){
        this.amount = -lastVal;
        this.childIndex = i;
        this.onSelectedItem.emit({ item: this.items[this.childIndex], index: this.childIndex });
        return;
      }
      lastVal = counter;
    }
    return counter;
  }

  scroll(forward, elem,maxWidth,minWidth) {
    this.childIndex += forward ? 1 : -1;
    this.onSelectedItem.emit({ item: this.items[this.childIndex], index: this.childIndex });
    let offsetWidth=20
    // Means that all the items can fit into wrapper
    if((maxWidth-minWidth)==0)
      return
    this.amount=-this.calculateScroll(elem)
    if(this.calculateScroll(elem)>=(maxWidth-minWidth))
      this.disableNext=true
    else
      this.disableNext=false
  }

  calculateScroll(elem) {  
    let counter = 0;
    for (let i = this.childIndex-1; i >= 0; i--) {
      const el = elem.children[i];
      const style = el.currentStyle || window.getComputedStyle(el);
      counter += el.offsetWidth + (parseFloat(style.marginLeft) + parseFloat(style.marginRight));
    }
    return counter;
  }

  ngOnChanges(changes) {
    if (changes.items && !isEqual(changes.items.previousValue, changes.items.currentValue))
      this.amount = 0;
  }
}

@NgModule({
  imports: [CommonModule],
  exports: [Ng2Carouselamos],
  declarations: [Ng2Carouselamos]
})
export class Ng2CarouselamosModule { }