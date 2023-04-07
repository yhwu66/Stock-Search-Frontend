import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { numberFormat } from 'highcharts';

@Component({
  selector: 'app-transaction-modal',
  templateUrl: './transaction-modal.component.html',
  styleUrls: ['./transaction-modal.component.css']
})
export class TransactionModalComponent implements OnInit {
  @Input() public ticker: string;
  @Input() public name: string;
  @Input() public currentprice: number;
  @Input() public opt: string; // 'Buy' or 'Sell'
  //@Output() passEntry: EventEmitter<any> = new EventEmitter();
  inputQuantity: number = 0;
  purchasedQuantity: number = 0;
  moneyLeft: number;

  stockItem;

  constructor(public transactionModalService: NgbActiveModal) { }
  makeTransaction() {
    let curPortfolioObj = localStorage.getItem('Portfolio') ? JSON.parse(localStorage.getItem('Portfolio')) : [];
    if (this.opt === 'Buy') {
      this.moneyLeft -= this.currentprice * this.inputQuantity;
      localStorage.setItem('Moneyleft', this.moneyLeft.toString());
      let portfolioItem;
      if (curPortfolioObj.filter((item) => item.ticker == this.ticker).length) {
        portfolioItem = curPortfolioObj.filter((item) => item.ticker == this.ticker)[0]
        portfolioItem.quantity += this.inputQuantity;
        portfolioItem.totalcost += this.inputQuantity * this.currentprice;
      }
      else {
        portfolioItem = { ticker: this.ticker, name: this.name, quantity: this.inputQuantity, totalcost: this.inputQuantity * this.currentprice }
        curPortfolioObj.push(portfolioItem);
      }
      localStorage.setItem('Portfolio', JSON.stringify(curPortfolioObj));
    }
    else {
      this.moneyLeft += this.currentprice * this.inputQuantity;
      localStorage.setItem('Moneyleft', this.moneyLeft.toString());
      let portfolioItem;
      portfolioItem = curPortfolioObj.filter((item) => item.ticker == this.ticker)[0]
      portfolioItem.quantity -= this.inputQuantity;
      portfolioItem.totalcost -= this.inputQuantity * this.currentprice;
      if (portfolioItem.quantity <= 0) {
        let newPortfolioObj = curPortfolioObj.filter((item) => item.ticker != this.ticker.toUpperCase());
        localStorage.setItem('Portfolio', JSON.stringify(newPortfolioObj));
      }
      else {
        localStorage.setItem('Portfolio', JSON.stringify(curPortfolioObj));
      }
    }
    this.transactionModalService.close(this.stockItem);
  }

  ngOnInit(): void {
    this.moneyLeft = localStorage.getItem('Moneyleft') ? Number(JSON.parse(localStorage.getItem('Moneyleft'))) : 25000;
    this.moneyLeft = Number(this.moneyLeft.toFixed(2))

    let curPortfolioObj = localStorage.getItem('Portfolio') ? JSON.parse(localStorage.getItem('Portfolio')) : [];
    let portfolioItem;
    if (curPortfolioObj.filter((item) => item.ticker == this.ticker).length) {
      portfolioItem = curPortfolioObj.filter((item) => item.ticker == this.ticker)[0]
      this.purchasedQuantity = portfolioItem.quantity;
      
    }
    localStorage.setItem('Moneyleft', this.moneyLeft.toString())
  }

}
