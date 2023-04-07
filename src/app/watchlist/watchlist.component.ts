import { Component, OnInit } from '@angular/core';
import { MatListItem } from '@angular/material/list';
import { BackendService } from '../backend.service';
import { LatestPrice } from '../latestprice';
import { Router } from '@angular/router';
interface ListItem {
  ticker: string;
  name: string;
  latestprice:number;
  change:number;
  changeper:number;
}

@Component({
  selector: 'app-watchlist',
  templateUrl: './watchlist.component.html',
  styleUrls: ['./watchlist.component.css']
})
export class WatchlistComponent implements OnInit {
  isWatchListEmpty = true;
  arrWatchList:ListItem[]=[];
  title="My Watchlist"
  itemA = {ticker: "tsla",
    name: "string",
    latestprice:1,
    change:2,
    changeper:3}
  curWatchList;
  checkIsEmpty(){
    this.curWatchList = localStorage.getItem('Watchlist')? JSON.parse(localStorage.getItem('Watchlist')): [];
    if (this.curWatchList.length) {
      this.isWatchListEmpty = false;
    } else {
      this.isWatchListEmpty = true;
    }
  }
  getWatchList(){
    /*for(let i=0;i<this.curWatchList.length;i++){
      this.backendService.fetchLatestPrice(this.curWatchList[i]).subscribe((latestdatax) => {
        let listItem:ListItem = {ticker: this.curWatchList[i],
        name: this.curWatchList[i],
        latestprice:latestdatax.c,
        change:latestdatax.d,
        changeper: latestdatax.dp,
        }
        this.arrWatchList.push(listItem)
      });
      
    }*/
    this.curWatchList.forEach((item) => {
      this.backendService.fetchLatestPrice(item.ticker).subscribe((latestdatax) => {
        let listItem:ListItem = {ticker: item.ticker,
        name: item.name,
        latestprice:latestdatax.c,
        change:latestdatax.d,
        changeper: Number(latestdatax.dp.toFixed(2))
        }
        this.arrWatchList.push(listItem)
      });
    });
  }
  constructor(
    private backendService: BackendService, 
    private router: Router) { }
  removeFromWatchList(itemInlist:ListItem){
    this.arrWatchList.splice(this.arrWatchList.indexOf(itemInlist), 1);
    let curWatchListObj = localStorage.getItem('Watchlist') ?  JSON.parse(localStorage.getItem('Watchlist')):[];
    let newWatchListObj = curWatchListObj.filter((item)=>item.ticker!=itemInlist.ticker.toUpperCase());
    localStorage.setItem('Watchlist',JSON.stringify(newWatchListObj));
    this.checkIsEmpty();
  }
  goSearch(ticker:string){
    this.router.navigateByUrl('/search/' + ticker);
  }
  
  ngOnInit(): void {
    this.checkIsEmpty();
    this.getWatchList();
  }

}
