import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

import { StockDetail } from './stockdetail';
import { LatestPrice } from './latestprice';
import { NewsDetail } from './newsdetail';
import { HisData } from './hisdata';
import { AutoComplete } from './autocomplete';
import { RecommTrend } from './recommtrend';
import { SocialSentiment } from './socialsentiment';
import { CompanyEarning } from './companyearning';

@Injectable({
  providedIn: 'root'
})
export class BackendService {
  //private HOST = 'http://localhost:3000/';
  //private HOST = 'https://nodejs-786565.wl.r.appspot.com/';
  private HOST = 'http://52.37.157.73:80/'
  private stockDetail = this.HOST + 'api/stockdetail';
  private latestPrice = this.HOST + 'api/latestprice';
  private newsDetail = this.HOST + 'api/news';
  private hisData = this.HOST + 'api/hisdata';
  private hourData = this.HOST + 'api/hourdata';
  private autoComplete = this.HOST + 'api/autocomplete';
  private recommTrend = this.HOST + 'api/recommtrend';
  private socialSentiment = this.HOST + 'api/socialsentiment';
  private companyPeer = this.HOST + 'api/companypeer';
  private companyEarning = this.HOST + 'api/companyearning';
  constructor(private http: HttpClient) {}

  fetchStockDetail(ticker: string): Observable<StockDetail> {
    const metaDataUrl = `${this.stockDetail}/${ticker.toUpperCase()}`;
    //const metaDataUrl = 'http://localhost:3000/api/stockdetail/'+ticker;
    return this.http.get<StockDetail>(metaDataUrl); //.subscribe(data => console.log(data));
    // .pipe(catchError(this.handleError('fetchMetadata', [])) // then handle the error
    // );
  }
  fetchLatestPrice(ticker: string): Observable<LatestPrice> {
    ticker = ticker.toString().toUpperCase();
    const metaDataUrl = `${this.latestPrice}/${ticker}`;
    //const metaDataUrl = 'http://localhost:3000/api/latestprice/'+'tsla'.toUpperCase( );
    return this.http.get<LatestPrice>(metaDataUrl); //.subscribe(data => console.log(data));
    // .pipe(catchError(this.handleError('fetchMetadata', [])) // then handle the error
    // );
  }

  fetchNewsDetail(ticker: string): Observable<NewsDetail[]> {
    const metaDataUrl = `${this.newsDetail}/${ticker.toUpperCase()}`;
    //const metaDataUrl = 'http://localhost:3000/api/news/TSLA';
    return this.http.get<NewsDetail[]>(metaDataUrl); //.subscribe(data => console.log(data));
    // .pipe(catchError(this.handleError('fetchMetadata', [])) // then handle the error
    // );
  }
  fetchHisData(ticker: string): Observable<HisData> {
    const metaDataUrl = `${this.hisData}/${ticker.toUpperCase( )}`;
    //const metaDataUrl = 'http://localhost:3000/api/news/TSLA';
    return this.http.get<HisData>(metaDataUrl); //.subscribe(data => console.log(data));
    // .pipe(catchError(this.handleError('fetchMetadata', [])) // then handle the error
    // );
  }
  fetchHourData(ticker: string,fromtime:string,totime:string): Observable<HisData> {
    
    const metaDataUrl = `${this.hourData}/${ticker.toUpperCase( )}/${fromtime}/${totime}`;
    //const metaDataUrl = 'http://localhost:3000/api/news/TSLA';
    return this.http.get<HisData>(metaDataUrl); //.subscribe(data => console.log(data));
    // .pipe(catchError(this.handleError('fetchMetadata', [])) // then handle the error
    // );
  }
  fetchAutoComplete(ticker: string): Observable<AutoComplete> {
    const metaDataUrl = `${this.autoComplete}/${ticker.toUpperCase( )}`;
    //const metaDataUrl = 'http://localhost:3000/api/news/TSLA';
    return this.http.get<AutoComplete>(metaDataUrl); //.subscribe(data => console.log(data));
    // .pipe(catchError(this.handleError('fetchMetadata', [])) // then handle the error
    // );
  }

  fetchRecommTrend(ticker: string): Observable<RecommTrend[]> {
    const metaDataUrl = `${this.recommTrend}/${ticker.toUpperCase( )}`;
    //const metaDataUrl = 'http://localhost:3000/api/news/TSLA';
    return this.http.get<RecommTrend[]>(metaDataUrl); //.subscribe(data => console.log(data));
    // .pipe(catchError(this.handleError('fetchMetadata', [])) // then handle the error
    // );
  }
  fetchSocialSentiment(ticker: string): Observable<SocialSentiment> {
    const metaDataUrl = `${this.socialSentiment}/${ticker.toUpperCase( )}`;
    //const metaDataUrl = 'http://localhost:3000/api/news/TSLA';
    return this.http.get<SocialSentiment>(metaDataUrl); //.subscribe(data => console.log(data));
    // .pipe(catchError(this.handleError('fetchMetadata', [])) // then handle the error
    // );
  }

  fetchCompanyEarning(ticker: string): Observable<CompanyEarning[]> {
    const metaDataUrl = `${this.companyEarning}/${ticker.toUpperCase( )}`;
    //const metaDataUrl = 'http://localhost:3000/api/news/TSLA';
    return this.http.get<CompanyEarning[]>(metaDataUrl); //.subscribe(data => console.log(data));
    // .pipe(catchError(this.handleError('fetchMetadata', [])) // then handle the error
    // );
  }

  fetchCompanyPeer(ticker: string): Observable<string[]> {
    const metaDataUrl = `${this.companyPeer}/${ticker.toUpperCase( )}`;
    //const metaDataUrl = 'http://localhost:3000/api/news/TSLA';
    return this.http.get<string[]>(metaDataUrl); //.subscribe(data => console.log(data));
    // .pipe(catchError(this.handleError('fetchMetadata', [])) // then handle the error
    // );
  }
}
