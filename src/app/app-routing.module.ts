import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SearchFormComponent } from './search-form/search-form.component';
import { WatchlistComponent } from './watchlist/watchlist.component';
import { StockdetailComponent } from './stockdetail/stockdetail.component';
import { PortfolioComponent } from './portfolio/portfolio.component';
const routes: Routes = [
  { path: '', component: SearchFormComponent },
  { path: 'search/:ticker', component: StockdetailComponent },
  //{ path: 'search/:ticker', component: SearchFormComponent },
  { path: 'watchlist', component: WatchlistComponent },
  { path: 'portfolio', component: PortfolioComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
