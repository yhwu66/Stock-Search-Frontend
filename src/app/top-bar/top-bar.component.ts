import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.css']
})
export class TopBarComponent implements OnInit {
  public isMenuCollapsed = true;
  constructor(private router: Router,
    private route: ActivatedRoute,) { }
  isSearch = false;
  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {


    });
  }

}
