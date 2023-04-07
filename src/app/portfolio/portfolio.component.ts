import { Component, OnInit } from '@angular/core';
import { MatListItem } from '@angular/material/list';
import { BackendService } from '../backend.service';
import { LatestPrice } from '../latestprice';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TransactionModalComponent } from '../transaction-modal/transaction-modal.component';
import { interval, Subject, Subscription, timer } from 'rxjs';
import { switchMap, debounceTime, takeWhile } from 'rxjs/operators';

interface PortfolioItem {
  ticker: string;
  name: string;
  currentprice: number;
  quantity: number;
  totalcost: number;
  avg:number;
  change:number;
  mktvalue:number;
}

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css']
})
export class PortfolioComponent implements OnInit {
  moneyLeft: number;
  curPortfolio;
  isPortfolioEmpty = false;
  arrPortfolio: PortfolioItem[] = [];
  buyMessage = '';
  sellMessage = '';
  _buyAlertSuccess = new Subject<string>();
  _sellAlertSuccess = new Subject<string>();
  transTicker = "";

  initMoney() {
    this.moneyLeft = localStorage.getItem('Moneyleft') ? JSON.parse(localStorage.getItem('Moneyleft')) : 25000;
    this.moneyLeft = Number(this.moneyLeft.toFixed(2));
    localStorage.setItem('Moneyleft', this.moneyLeft.toString())
  }
  constructor(private backendService: BackendService,
    private router: Router,
    private transactionModalService: NgbModal
  ) { }
  checkIsEmpty() {
    this.curPortfolio = localStorage.getItem('Portfolio') ? JSON.parse(localStorage.getItem('Portfolio')) : [];
    if (this.curPortfolio.length) {
      this.isPortfolioEmpty = false;
    } else {
      this.isPortfolioEmpty = true;
    }
  }
  getPortfolio() {
    this.curPortfolio = localStorage.getItem('Portfolio') ? JSON.parse(localStorage.getItem('Portfolio')) : [];
    this.arrPortfolio = [];
    this.curPortfolio.forEach((item) => {
      this.backendService.fetchLatestPrice(item.ticker).subscribe((latestdatax) => {
        let listItem: PortfolioItem = {
          ticker: item.ticker,
          name: item.name,
          currentprice: latestdatax.c,
          quantity: item.quantity,
          totalcost: Number(item.totalcost.toFixed(2)),
          avg:       Number( (item.totalcost/item.quantity).toFixed(2) ),
          change:    Number(    (latestdatax.c-item.totalcost/item.quantity).toFixed(2)    ),
          mktvalue:  Number(  ( latestdatax.c*item.quantity).toFixed(2)  )
        }
        this.arrPortfolio.push(listItem)
      });
    });
    this.checkIsEmpty();
  }
  launchTransactionModal(ticker, name, currentprice, opt) {
    const transactionModalRef = this.transactionModalService.open(TransactionModalComponent);
    transactionModalRef.componentInstance.ticker = ticker;
    transactionModalRef.componentInstance.name = name;
    transactionModalRef.componentInstance.currentprice = currentprice;
    transactionModalRef.componentInstance.opt = opt;
    transactionModalRef.result.then((recItem) => {
      // trigger opt alert
      this.getPortfolio();
      // for buy alert
      if (opt == 'Buy') {
        this._buyAlertSuccess.next('Message successfully changed.');
      }
      else {
        this._sellAlertSuccess.next('Message successfully changed.');
      }
      this.transTicker = ticker;
    });
  }

  ngOnInit(): void {
    this.initMoney();
    this.checkIsEmpty();
    this.getPortfolio();
    this._buyAlertSuccess.subscribe((message) => (this.buyMessage = message));
    this._buyAlertSuccess.pipe(debounceTime(5000)).subscribe(() => (this.buyMessage = ''));
    this._sellAlertSuccess.subscribe((message) => (this.sellMessage = message));
    this._sellAlertSuccess.pipe(debounceTime(5000)).subscribe(() => (this.sellMessage = ''));
  }

}
