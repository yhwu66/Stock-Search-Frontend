import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { interval, Subject, Subscription, timer } from 'rxjs';
import { switchMap, debounceTime, takeWhile } from 'rxjs/operators';
import { Router, NavigationEnd } from '@angular/router';
import * as Highcharts from 'highcharts/highstock';
import { Options } from 'highcharts/highstock';
declare var require: any;
require('highcharts/indicators/indicators')(Highcharts); // loads core and enables sma
require('highcharts/indicators/volume-by-price')(Highcharts); // loads enables vbp
import * as Highchartss from 'highcharts';

import * as moment from 'moment';
import 'moment-timezone';

declare var require: any;
//require('highcharts/indicators/indicators')(Highcharts); // loads core and enables sma
//require('highcharts/indicators/volume-by-price')(Highcharts); // loads enables vbp


//import 'moment-timezone';

import { BackendService } from '../backend.service';

import { StockDetail } from '../stockdetail';
import { LatestPrice } from '../latestprice';
import { NewsDetail } from '../newsdetail';
import { HisData } from '../hisdata';
import { AutoComplete } from '../autocomplete';
import { RecommTrend } from '../recommtrend';
import { SocialSentiment } from '../socialsentiment';
import { CompanyEarning } from '../companyearning';

import { TransactionModalComponent } from '../transaction-modal/transaction-modal.component';
import { NewsModalComponent } from '../news-modal/news-modal.component';



import { UniqueSelectionDispatcher } from '@angular/cdk/collections';
function LATimezonOffset(timestamp) {
  var zone = 'America/Los_Angeles',
    timezoneOffset = -moment.tz(timestamp, zone).utcOffset();

  return timezoneOffset;
}
@Component({
  selector: 'app-stockdetail',
  templateUrl: './stockdetail.component.html',
  styleUrls: ['./stockdetail.component.css']
})
export class StockdetailComponent implements OnInit {
  stockdata: StockDetail;
  latestpricedata: LatestPrice;
  newsdata: NewsDetail[];
  hisdata: HisData;
  hourdata: HisData;
  autocompletedata: AutoComplete;
  recommtrenddata: RecommTrend[];
  socialsentimentdata: SocialSentiment;
  companyearningdata: CompanyEarning[];
  companypeerdata: string[];
  isstockdata = false;
  islatestpricedata = false;
  isnewsdata = false;
  ishisdata = false;
  ishourdata = false;
  isautocompletedata = false;
  isrecommtrenddata = false;
  issocialsentimentdata = false;
  iscompanyearningdata = false;
  iscompanypeerdata = false;

  fetchTestTime;

  fetchSubscribe;
  hourChartsColor;

  ticker: string = 'tsla';
  tickerExist = true;
  showComponent = true;
  mentions = [[0, 0, 0], [0, 0, 0]];
  ifInWatchList = false;
  ifInPortfolio = false;
  priceColor;
  isUp = true;
  isOpen = true;

  // high charts setting area
  dailyChartsFinish = false;
  histChartsFinish = false;
  isHighcharts = typeof Highcharts === 'object';
  chartConstructor = 'stockChart';
  Highcharts: typeof Highcharts = Highcharts; // required
  Highchartss: typeof Highchartss = Highchartss; // required

  highcharts = Highcharts;
  highchartss = Highchartss;

  dailyChartOptions: Highcharts.Options;
  histChartOptions: Options;
  stackedcolumnChartOptions: Highcharts.Options;
  splineChartOptions: Options;

  localTimeString;

  buyMessage = '';
  sellMessage = '';
  addMessage = '';
  removeMessage = '';
  _buyAlertSuccess = new Subject<string>();
  _sellAlertSuccess = new Subject<string>();
  _addAlertSuccess = new Subject<string>();
  _removeAlertSuccess = new Subject<string>();
  constructor(
    private route: ActivatedRoute,
    private backendService: BackendService,
    private router: Router,
    private newsModalService: NgbModal,
    private transactionModalService: NgbModal
  ) { }
  fetchStockDetail() {
    //this.ticker = 
    this.backendService.fetchStockDetail(this.ticker).subscribe((metadatax) => {
      this.stockdata = metadatax;
      this.isstockdata = true;
      if (this.stockdata.ticker) {
        this.tickerExist = true;
      } else {
        this.tickerExist = false;
      }
      //console.log('Metadata fetched ' + Date());
      // console.log(this.metadata);
    });
  }

  fetchLatestPrice() {
    //this.ticker = 

    this.fetchSubscribe = timer(0, 15000).subscribe(() => {
      this.backendService.fetchLatestPrice(this.ticker).subscribe((latestdatax) => {
        this.latestpricedata = latestdatax;
        this.islatestpricedata = true;
        this.latestpricedata.dp = Number(this.latestpricedata.dp.toFixed(2));
        if (this.latestpricedata.t) {
          let fetchtime = new Date(this.latestpricedata.t * 1000)
          let year = fetchtime.getFullYear();
          let month = "0" + (fetchtime.getMonth() + 1);
          let date = "0" + fetchtime.getDate();
          let hour = "0" + fetchtime.getHours();
          let minute = "0" + fetchtime.getMinutes();
          let second = "0" + fetchtime.getSeconds()
          this.localTimeString = year + '-' + month.substr(-2) + '-' + date.substr(-2)
            + ' ' + hour.substr(-2) + ':' + minute.substr(-2) + ':' + second.substr(-2);
          if (this.latestpricedata.d >= 0) {
            this.isUp = true;
            this.hourChartsColor = '#008000';
          }
          else {
            this.isUp = false;
            this.hourChartsColor = '#FF0000';
          }


          let curTime = new Date();
          let curUnixStamp = Math.floor(curTime.getTime() / 1000);
          this.fetchTestTime = curUnixStamp;
          console.log(curUnixStamp);
          console.log(latestdatax.t);
          if ((curUnixStamp - latestdatax.t) >= 5 * 60) {
            this.isOpen = false;
            this.fetchHourData((latestdatax.t - 6 * 60 * 60).toString(), latestdatax.t.toString());   //
          }
          else {
            this.isOpen = true;
            this.fetchHourData((curUnixStamp - 6 * 60 * 60).toString(), curUnixStamp.toString());  //
          }
        }

      });
    });
  }
  fetchNewsDetail() {
    //this.ticker = 
    this.backendService.fetchNewsDetail(this.ticker).subscribe((latestdatax) => {
      this.newsdata = latestdatax;
      this.isnewsdata = true;

      //console.log('Metadata fetched ' + Date());
      // console.log(this.metadata);
    });
  }
  fetchHisData() {
    //this.ticker = 
    this.backendService.fetchHisData(this.ticker).subscribe((latestdatax) => {
      this.hisdata = latestdatax;
      this.ishisdata = true;

      this.histChartsFinish = false;
      let i, intTimestamp;
      if (this.hisdata.t) {
        // split the data set into ohlc and volume
        let ohlc = [],
          volume = [],
          dataLength = this.hisdata.t.length,
          // set the allowed units for data grouping
          groupingUnits = [
            [
              'week', // unit name
              [1], // allowed multiples
            ],
            ['month', [1, 2, 3, 4, 6]],
          ];

        for (i = 0; i < dataLength; i += 1) {
          //intTimestamp = Date.parse(this.histcharts[i].date);
          ohlc.push([
            this.hisdata.t[i] * 1000, // the date
            this.hisdata.o[i], // open
            this.hisdata.h[i], // high
            this.hisdata.l[i], // low
            this.hisdata.c[i], // close
          ]);

          volume.push([
            this.hisdata.t[i] * 1000, // the date
            this.hisdata.v[i], // the volume
          ]);
        }

        this.histChartOptions = {
          series: [
            {
              type: 'candlestick',
              name: this.ticker.toUpperCase(),
              id: this.ticker,
              zIndex: 2,
              data: ohlc,
            },
            {
              type: 'column',
              name: 'Volume',
              id: 'volume',
              data: volume,
              yAxis: 1,
            },
            {
              type: 'vbp',
              linkedTo: this.ticker,
              params: {
                volumeSeriesID: 'volume',
              },
              dataLabels: {
                enabled: false,
              },
              zoneLines: {
                enabled: false,
              },
            },
            {
              type: 'sma',
              linkedTo: this.ticker,
              zIndex: 1,
              marker: {
                enabled: false,
              },
            },
          ],
          title: { text: this.ticker.toUpperCase() + ' Historical' },
          subtitle: {
            text: 'With SMA and Volume by Price technical indicators',
          },
          yAxis: [
            {
              startOnTick: false,
              endOnTick: false,
              labels: {
                align: 'right',
                x: -3,
              },
              title: {
                text: 'OHLC',
              },
              height: '60%',
              lineWidth: 2,
              resize: {
                enabled: true,
              },
            },
            {
              labels: {
                align: 'right',
                x: -3,
              },
              title: {
                text: 'Volume',
              },
              top: '65%',
              height: '35%',
              offset: 0,
              lineWidth: 2,
            },
          ],
          tooltip: {
            split: true,
          },
          plotOptions: {
            // series: {
            //   dataGrouping: {
            //     units: groupingUnits,
            //   },
            // },
          },
          rangeSelector: {
            buttons: [
              {
                type: 'month',
                count: 1,
                text: '1m',
              },
              {
                type: 'month',
                count: 3,
                text: '3m',
              },
              {
                type: 'month',
                count: 6,
                text: '6m',
              },
              {
                type: 'ytd',
                text: 'YTD',
              },
              {
                type: 'year',
                count: 1,
                text: '1y',
              },
              {
                type: 'all',
                text: 'All',
              },
            ],
            selected: 2,
          },

        }; // required
        this.histChartsFinish = true;
      }
      //console.log('Metadata fetched ' + Date());
      // console.log(this.metadata);
    });
  }
  fetchHourData(fromtime: string, totime: string) {
    //this.ticker = 
    this.backendService.fetchHourData(this.ticker, fromtime, totime).subscribe((latestdatax) => {
      this.hourdata = latestdatax;
      this.ishourdata = true;

      if (this.hourdata.t) {
        let dailyClose = [],
          dataLength = this.hourdata.t.length;
        let i, intTimestamp;

        for (i = 0; i < dataLength; i += 1) {
          //intTimestamp = Date.parse(this.dailycharts[i].date);
          dailyClose.push([this.hourdata.t[i] * 1000, this.hourdata.c[i]]);
        }

        this.dailyChartOptions = {
          series: [
            {
              data: dailyClose,
              color: this.hourChartsColor,
              showInNavigator: true,
              name: this.ticker.toUpperCase(),
              type: 'line',
              tooltip: {
                valueDecimals: 2,
              },
            },
          ],
          title: { text: this.ticker.toUpperCase() + ' Hourly Price Variation' },
          rangeSelector: {
            enabled: false,
          },
          navigator: {
            enabled: false,
            series: {
              type: 'area',
              color: 'red',
              fillOpacity: 1,
            },
          },
          time: {
            getTimezoneOffset: LATimezonOffset,
          },

        }; // required
      }

      //console.log('Metadata fetched ' + Date());
      // console.log(this.metadata);
    });
  }

  fetchAutoComplete() {
    //this.ticker = 
    this.backendService.fetchAutoComplete(this.ticker).subscribe((latestdatax) => {
      this.autocompletedata = latestdatax;

      //console.log('Metadata fetched ' + Date());
      // console.log(this.metadata);
    });
  }
  fetchRecommTrend() {
    //this.ticker = 
    this.backendService.fetchRecommTrend(this.ticker).subscribe((latestdatax) => {
      this.recommtrenddata = latestdatax;
      this.isrecommtrenddata = true;

      let recommlength = this.recommtrenddata.length;
      let buy = [];
      let sell = [];
      let hold = [];
      let strongBuy = [];
      let strongSell = [];
      let recommcate = [];
      for (let i = 0; i < recommlength; i++) {
        recommcate.push(this.recommtrenddata[i].period);
        buy.push(this.recommtrenddata[i].buy);
        sell.push(this.recommtrenddata[i].sell);
        hold.push(this.recommtrenddata[i].hold);
        strongBuy.push(this.recommtrenddata[i].strongBuy);
        strongSell.push(this.recommtrenddata[i].strongSell);

      }
      this.stackedcolumnChartOptions = {
        chart: {
          type: 'column'
        },
        title: {
          text: 'Recommendation Trends'
        },
        xAxis: {
          categories: recommcate
        },
        yAxis: {
          min: 0,
          title: {
            text: 'Analysis'
          },
          stackLabels: {
            enabled: true,
            style: {
              fontWeight: 'bold',
              color: 'gray'
            }
          }
        },
        legend: {
          align: 'center',
          x: -5,
          verticalAlign: 'bottom',
          y: 0,
          floating: false,
          backgroundColor: 'white',

          shadow: false
        },
        tooltip: {
          headerFormat: '<b>{point.x}</b><br/>',
          pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
        },
        plotOptions: {
          column: {
            stacking: 'normal',
            dataLabels: {
              enabled: true
            }
          }
        },
        series: [{
          name: 'buy',
          type: 'column',
          data: buy,
          color: 'red'
        }, {
          name: 'sell',
          type: 'column',
          data: sell
        }, {
          name: 'hold',
          type: 'column',
          data: hold
        }, {
          name: 'StrongBuy',
          type: 'column',
          data: strongBuy
        }, {
          name: 'StrongSell',
          type: 'column',
          data: strongBuy
        }]

      };
      //console.log('Metadata fetched ' + Date());
      // console.log(this.metadata);
    });
  }
  fetchSocialSentiment() {
    //this.ticker = 
    this.backendService.fetchSocialSentiment(this.ticker).subscribe((latestdatax) => {
      this.socialsentimentdata = latestdatax;
      this.issocialsentimentdata = true;
      if (this.socialsentimentdata.reddit && this.socialsentimentdata.twitter) {
        for (let i = 0; i < this.socialsentimentdata.reddit.length; i++) {
          this.mentions[0][0] += this.socialsentimentdata.reddit[i].mention;
          this.mentions[0][1] += this.socialsentimentdata.reddit[i].positiveMention;
          this.mentions[0][2] += this.socialsentimentdata.reddit[i].negativeMention;
        }
        for (let i = 0; i < this.socialsentimentdata.twitter.length; i++) {
          this.mentions[1][0] += this.socialsentimentdata.twitter[i].mention;
          this.mentions[1][1] += this.socialsentimentdata.twitter[i].positiveMention;
          this.mentions[1][2] += this.socialsentimentdata.twitter[i].negativeMention;
        }
      }

      //console.log('Metadata fetched ' + Date());
      // console.log(this.metadata);
    });
  }
  fetchCompanyEarning() {
    //this.ticker = 
    this.backendService.fetchCompanyEarning(this.ticker).subscribe((latestdatax) => {
      this.companyearningdata = latestdatax;
      this.iscompanyearningdata = true;

      let earninglength = this.companyearningdata.length;
      let seriedataAc = [];
      let seriedataEs = [];
      let xCate = [];
      for (let i = 0; i < earninglength; i++) {
        //seriedataAc.push([this.companyearningdata[i].period, this.companyearningdata[i].actual]);
        //seriedataEs.push([this.companyearningdata[i].period, this.companyearningdata[i].estimate])
        seriedataAc.push(this.companyearningdata[i].actual);
        seriedataEs.push(this.companyearningdata[i].estimate)
        xCate.push(this.companyearningdata[i].period)
      }
      this.splineChartOptions = {

        chart: {
          type: 'spline',
          inverted: false
        },
        title: {
          text: 'Historical EPS Surprises'
        },
        subtitle: {
          text: ''
        },
        xAxis: {
          categories: xCate,
          reversed: false,
          title: {
            //enabled: true,
            //text: 'Altitude'
          },
          labels: {
            format: '{value}'
          },
          accessibility: {
            //rangeDescription: 'Range: 0 to 80 km.'
          },
          maxPadding: 0.05,
          showLastLabel: true
        },
        yAxis: {

          title: {
            text: 'Quarterly EPS'
          },
          labels: {
            format: '{value}'
          },
          accessibility: {
            //rangeDescription: 'Range: -90°C to 20°C.'
          },
          lineWidth: 2
        },
        legend: {
          align: 'center',
          x: -5,
          verticalAlign: 'bottom',
          y: 0,
          floating: false,
          backgroundColor: 'white',

          shadow: false
        },
        tooltip: {
          
          shared: true,
          //headerFormat: '{point.x}',
          //pointFormat: '<span>">●</span> <span> {series.name}: </span><b>{point.y}</b>'
        },

        plotOptions: {
          spline: {
            marker: {
              //enable: false
            }
          }
        },
        series: [{
          name: 'Actual',
          type: 'spline',
          data: seriedataAc
        }, {
          name: 'Estimate',
          type: 'spline',
          data: seriedataEs
        }]
      };
      //console.log('Metadata fetched ' + Date());
      // console.log(this.metadata);
    });
  }
  fetchCompanyPeer() {
    //this.ticker = 
    this.backendService.fetchCompanyPeer(this.ticker).subscribe((latestdatax) => {
      this.companypeerdata = latestdatax;
      this.iscompanypeerdata = true;

      //console.log('Metadata fetched ' + Date());
      // console.log(this.metadata);
    });
  }


  ngOnInit(): void {
    const routeParams = this.route.snapshot.paramMap;
    const productIdFromRoute = String(routeParams.get('ticker'));
    this.ticker = productIdFromRoute.toUpperCase();
    this.route.paramMap.subscribe((params) => {
      this.isstockdata = false;
      this.islatestpricedata = false;
      this.isnewsdata = false;
      this.ishisdata = false;
      this.ishourdata = false;
      this.isautocompletedata = false;
      this.isrecommtrenddata = false;
      this.issocialsentimentdata = false;
      this.iscompanyearningdata = false;
      this.iscompanypeerdata = false;
      this.ticker = String(params.get('ticker')).toUpperCase();
      this.checkIfinWatchList();
      this.checkIfinPortfolio();
      this.fetchStockDetail();
      this.fetchLatestPrice();
      this.fetchNewsDetail();
      this.fetchHisData();         //
      //this.fetchHourData();
      this.fetchRecommTrend();
      this.fetchSocialSentiment();
      this.fetchCompanyEarning();
      this.fetchCompanyPeer();
      this._buyAlertSuccess.subscribe((message) => (this.buyMessage = message));
      this._buyAlertSuccess.pipe(debounceTime(5000)).subscribe(() => (this.buyMessage = ''));
      this._sellAlertSuccess.subscribe((message) => (this.sellMessage = message));
      this._sellAlertSuccess.pipe(debounceTime(5000)).subscribe(() => (this.sellMessage = ''));

      this._addAlertSuccess.subscribe((message) => (this.addMessage = message));
      this._addAlertSuccess.pipe(debounceTime(5000)).subscribe(() => (this.addMessage = ''));
      this._removeAlertSuccess.subscribe((message) => (this.removeMessage = message));
      this._removeAlertSuccess.pipe(debounceTime(5000)).subscribe(() => (this.removeMessage = ''));

    });

  }
  changeWatchList() {
    this.ifInWatchList = !this.ifInWatchList;
    let curWatchListObj = localStorage.getItem('Watchlist') ? JSON.parse(localStorage.getItem('Watchlist')) : [];
    let newWatchListObj;
    if (this.ifInWatchList) {
      //add
      let listItem = { ticker: this.ticker.toUpperCase(), name: this.stockdata.name };
      curWatchListObj.push(listItem);
      localStorage.setItem('Watchlist', JSON.stringify(curWatchListObj));
      this._addAlertSuccess.next('Message successfully changed.');
    }
    else {
      //remove
      newWatchListObj = curWatchListObj.filter((item) => item.ticker != this.ticker.toUpperCase());
      localStorage.setItem('Watchlist', JSON.stringify(newWatchListObj));
      this._removeAlertSuccess.next('Message successfully changed.');
    }
  }
  checkIfinWatchList() {
    let curWatchListObj = localStorage.getItem('Watchlist') ? JSON.parse(localStorage.getItem('Watchlist')) : [];
    let checkResult = curWatchListObj.filter((item) => item.ticker === this.ticker.toUpperCase());
    if (checkResult.length) {
      this.ifInWatchList = true;
    }
    else {
      this.ifInWatchList = false;
    }
  }

  checkIfinPortfolio() {
    let curPortfolioObj = localStorage.getItem('Portfolio') ? JSON.parse(localStorage.getItem('Portfolio')) : [];
    let checkResult = curPortfolioObj.filter((item) => item.ticker === this.ticker.toUpperCase());
    if (checkResult.length) {
      this.ifInPortfolio = true;
    }
    else {
      this.ifInPortfolio = false;
    }
  }

  launchTransactionModal(opt) {
    const transactionModalRef = this.transactionModalService.open(TransactionModalComponent);
    transactionModalRef.componentInstance.ticker = this.ticker;
    transactionModalRef.componentInstance.name = this.stockdata.name;
    transactionModalRef.componentInstance.currentprice = this.latestpricedata.c;
    transactionModalRef.componentInstance.opt = opt;
    transactionModalRef.result.then((recItem) => {
      // trigger opt alert
      console.log(recItem);
      // for buy alert
      if (opt == 'Buy') {
        this._buyAlertSuccess.next('Message successfully changed.');
      }
      else {
        this._sellAlertSuccess.next('Message successfully changed.');
      }
      this.checkIfinPortfolio()
    });
  }
  launchNewsModal(source: string,
    category: string,
    image: string,
    datetime: number,
    url: string,
    headline: string,
    summary: string,
    related: string) {
    const newsModalRef = this.newsModalService.open(NewsModalComponent);
    newsModalRef.componentInstance.source = source;
    newsModalRef.componentInstance.category = category;
    newsModalRef.componentInstance.image = image;
    newsModalRef.componentInstance.datetime = datetime;
    newsModalRef.componentInstance.url = url;
    newsModalRef.componentInstance.headline = headline;
    newsModalRef.componentInstance.summary = summary;
    newsModalRef.componentInstance.related = related;

    /*newsModalRef.result.then((recItem) => {
      // trigger opt alert
      console.log(recItem);
      // for buy alert

    });*/
  }
  ngOnDestroy() {
    this.fetchSubscribe.unsubscribe();

    //console.log(`Exist from Details/${this.ticker}`);
  }




}
