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

  ngOnInit() {
    if(!sessionStorage.getItem("username")){
      console.log("No Username found.");
      this.router.navigateByUrl("home");
    } else {
      console.log("ngOnInit");
      this.getGroups();
    }
  }

  getGroups() {
    this._dashService.getGroups(sessionStorage.getItem("username"), sessionStorage.getItem("access_level")).subscribe(
      data => { this.groups = data },
      err => console.error(err),
      () => console.log('Found Groups')
    );
  }

  navigateChat(channel) {
    this.router.navigateByUrl("chat");
  }
}