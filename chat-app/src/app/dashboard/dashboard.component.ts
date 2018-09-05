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

  constructor(private _dashService: DashInterfaceService, private router:Router) { }

  ngOnInit() {
    if (!sessionStorage.getItem("username")) {
      this.router.navigateByUrl("home");
    }
  }

}
