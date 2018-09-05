import { Component, OnInit } from '@angular/core';
import { DashInterfaceService } from '../dash-interface.service';
import { GroupsService } from '../groups.service';
import { ChannelsService } from '../channels.service';
import { UsersService } from '../users.service';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {

  public users;
  public channels;
  public groups;
  public shownGroups = [];

  constructor(private _dashService: DashInterfaceService, private _userService: UsersService, private _channelService: ChannelsService, private _groupService: GroupsService, private router:Router) { }

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
    console.log("getGroups");
    this._groupService.getGroups().subscribe(
      data => { this.groups = data },
      err => console.error(err),
      () => console.log('Found Groups')
    );
    console.log(this.groups);
    sessionStorage.setItem("groups", this.groups)
  }

  navigateChat(channel) {
    this.router.navigateByUrl("chat");
  }
}