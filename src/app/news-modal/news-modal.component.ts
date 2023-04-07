import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-news-modal',
  templateUrl: './news-modal.component.html',
  styleUrls: ['./news-modal.component.css']
})
export class NewsModalComponent implements OnInit {
  @Input() public source:string;
  @Input() public category: string;
  @Input() public image:string;
  @Input() public datetime:number;
  @Input() public url:string;
  @Input() public headline:string;
  @Input() public summary:string;
  @Input() public related:string;
  constructor(public newsModalService: NgbActiveModal) { }
  fbSrc;
  localTimeString;
  

  goToLink(url: string) {
    window.open(url, '_blank');
  }
  getMonthString(n:number):string{

    if(n==1){
      return "January"
    }else if(n==2){
      return "February"
    }else if(n==3){
      return "March"
    }else if(n==4){
      return "April"
    }else if(n==5){
      return "May"
    }else if(n==6){
      return "June"
    }else if(n==7){
      return "July"
    }else if(n==8){
      return "August"
    }else if(n==9){
      return "September"
    }else if(n==10){
      return "October"
    }else if(n==11){
      return "November"
    }else{
      return "December"
    }
    return
  }
  ngOnInit(): void {
    this.fbSrc = 'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(this.url) + '&amp;src=sdkpreparse';
    let fetchtime = new Date(this.datetime * 1000)
        let year = fetchtime.getFullYear();
        let month = "0"+ (fetchtime.getMonth()+1);
        let date = "0"+ fetchtime.getDate();
        let hour = "0"+ fetchtime.getHours();
        let minute = "0" + fetchtime.getMinutes();
        let second = "0" + fetchtime.getSeconds()
        let monthString = this.getMonthString(fetchtime.getMonth()+1);
        
        this.localTimeString = year + '-' + month.substr(-2) + '-' + date.substr(-2)
                               + ' ' + hour.substr(-2) + ':' + minute.substr(-2) + ':' + second.substr(-2);
        this.localTimeString = monthString + " " + date.substr(-2) + ", " + year;

  }

}
