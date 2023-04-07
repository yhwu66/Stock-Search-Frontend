import { BoundText } from '@angular/compiler/src/render3/r3_ast';
import { ActivatedRoute } from '@angular/router';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { fromEvent, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map, startWith, takeUntil, tap } from 'rxjs/operators';
import { BackendService } from '../backend.service';
import { AutoComplete } from '../autocomplete';
import { FormBuilder, FormGroup } from '@angular/forms';

export interface SearchTicker {
  ticker: string;
  name: string;
}
@Component({
  selector: 'app-search-form',
  templateUrl: './search-form.component.html',
  styleUrls: ['./search-form.component.css']
})
export class SearchFormComponent implements OnInit {

  @ViewChild('box', { static: true }) box: ElementRef;

  myControl = new FormControl();
  options:SearchTicker[] = [];
  filteredOptions: Observable<SearchTicker[]>;
  ticker = "i";
  inputfruser = "";
  flag = true;
  searchForm: FormGroup;
  autocompletedata: AutoComplete;

  aclist:SearchTicker[] = [];
  isReComplete = false;
  ifEmpty = false;
  ifExist = true;
  ifShow = false;
  _unsubscribeAll;
  isLoading = false;
  constructor(
    private route: ActivatedRoute,
    private backendService: BackendService,
    private router: Router,
  ) { }
  ngOnInit() {
    this.filteredOptions = this.myControl.valueChanges.pipe(

      startWith(''),

      map(value => this._filter(value)),
    );

    fromEvent(this.box.nativeElement, 'keyup').pipe(

      // get value
      map((event: any) => {
        return event.target.value;
      })
      // if character length greater then 2
      , filter(res => res.length >= 0)

      // Time in milliseconds between key events
      , debounceTime(1000)

      // If previous query is diffent from current   
      , distinctUntilChanged()

      // subscription for response
    ).subscribe((text: string) => {

      this.aclist = [];
      this.options = this.aclist;
      this.isLoading = true;
      this.ifEmpty = false;
      this.ifExist = true;
      this.inputfruser = text;
      this.fetchAutoComplete();

      if (this.inputfruser === "") {
        this.aclist = [];
        this.options = this.aclist;
        this.isLoading = false;
      }
      this.filteredOptions = this.myControl.valueChanges.pipe(
        startWith(''),
        map(value => this._filter(value)),
      );

    });


    //this.options = ['one']
  }
  onSubmit(tickerData) {
    if (tickerData.tickerInput.ticker) {
      this.inputfruser = tickerData.tickerInput.ticker;
    } else {
      this.inputfruser = tickerData.tickerInput;
    }
    console.log('ticker name in form: ', this.inputfruser);
    this.router.navigateByUrl('/search/' + this.inputfruser);
    this.searchForm.reset();
  }

  private _filter(value: string): SearchTicker[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.ticker.toLowerCase().includes(filterValue));
  }
  myFunc(value: string) {
    this.isReComplete = false;
    this.ticker = value;
    this.router.navigateByUrl('/search/' + this.ticker);
    this.isReComplete = true;

  }
  clearSearch() {
    this.router.navigateByUrl('');
  }
  startSearch(value: string) {
    this.ticker = value;
    if (value != "") {
      this.backendService.fetchStockDetail(this.ticker).subscribe((metadatax) => {
        let stockdata = metadatax;
        if (stockdata.ticker) {
          this.ifExist = true;
          this.router.navigateByUrl('/search/' + this.ticker);
        } else {
          this.ifExist = false;
        }
        //console.log('Metadata fetched ' + Date());
        // console.log(this.metadata);
      });

    }
    else {
      this.ifEmpty = true;
    }

  }
  getInputValue(value: string) {
    this.aclist = [];
    this.options = this.aclist;
    this.isLoading = true;
    this.ifEmpty = false;
    this.ifExist = true;
    this.inputfruser = value;
    this.fetchAutoComplete();

    if (this.inputfruser === "") {
      this.aclist = [];
      this.options = this.aclist;
    }
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value)),
    );
  }
  fetchAutoComplete() {
    //this.ticker = 
    this.backendService.fetchAutoComplete(this.inputfruser).subscribe((latestdatax) => {
      this.autocompletedata = latestdatax;
      this.isLoading = false;

      this.aclist = [];
      for (let i = 0; i < this.autocompletedata.count; i++) {
        let tmpsym = this.autocompletedata.result[i].symbol;
        if (!tmpsym.includes('.')) {
          let pushitem: SearchTicker = {
            ticker:tmpsym,
            name: this.autocompletedata.result[i].description
          }
          this.aclist.push(
            //{
            
            //}tmpsym
            //tmpsym
            pushitem
          );
        }

      }
      this.flag = false;

      this.options = this.aclist;
      this.filteredOptions = this.myControl.valueChanges.pipe(
        startWith(''),
        map(value => this._filter(value)),
      );

    });
  }

}
