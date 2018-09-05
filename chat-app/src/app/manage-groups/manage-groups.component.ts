import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GroupsService } from '../groups.service';

@Component({
  selector: 'app-manage-groups',
  templateUrl: './manage-groups.component.html',
  styleUrls: ['./manage-groups.component.css']
})
export class ManageGroupsComponent implements OnInit {

  public groups;

  constructor(private router:Router, private _groupService: GroupsService) { }

  ngOnInit() {
    if(!sessionStorage.getItem("username")){
      console.log("No Username found.");
      this.router.navigateByUrl("home");
    } else {
      console.log("ngOnInit");
      this.getGroups();
    }
  }

  getGroups(){
    console.log("getChannels");
    this._groupService.getChannels().subscribe(
      data => { this.groups = data },
      err => console.error(err),
      () => console.log('Found Groups')
    );
  }

  addChannelToGroup(channel_name, group) {
    console.log("addChannelToGroup");
    this._groupService.addChannelToGroup(channel_name, group).subscribe(
      data => { this.groups = data },
      err => console.error(err),
      () => console.log('Added User To Channel')
    )
  }
}