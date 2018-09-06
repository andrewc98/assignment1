import { Component, OnInit } from '@angular/core';
import { DashInterfaceService } from '../dash-interface.service';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {

  public groups;
  public shownGroups = [];

  constructor(private _dashService: DashInterfaceService, private router:Router) { }

  /*
    Author -------- Andrew Campbell
    Date ---------- 06/09/2018
    Description --- This function is used to call getGroups, or redirect to login
  */
  ngOnInit() {
    if(!sessionStorage.getItem("username")){
      console.log("No Username found.");
      this.router.navigateByUrl("home");
    } else {
      console.log("ngOnInit");
      this.getGroups();
    }
  }

  /*
    Author -------- Andrew Campbell
    Date ---------- 06/09/2018
    Description --- This function is used to get the groups that the user is allowed to see.
  */
  getGroups() {
    this._dashService.getGroups(sessionStorage.getItem("username"), sessionStorage.getItem("access_level")).subscribe(
      data => { this.groups = data },
      err => console.error(err),
      () => console.log('Found Groups')
    );
  }

  /*
    Author -------- Andrew Campbell
    Date ---------- 06/09/2018
    Description --- This just navigates to chat until assignment 2.
  */
  navigateChat(channel) {
    this.router.navigateByUrl("chat");
  }
}