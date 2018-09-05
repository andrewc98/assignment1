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
    this._groupService.getGroups().subscribe(
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

  /*
    Author ------- Andrew Campbell
    Date --------- 05/09/2018
    Description -- This function is used to create a new group.
  */
  createGroup(group_name){
    console.log("Here :D");
    let body = {
      group_name: group_name,
      channels: []
    }
    this._groupService.createGroups(body).subscribe(
      data => {
        this.getGroups();
        return true;
      },
      error => {
        console.error(error);
        console.error('Unexpected error encountered creating group.');
      }
    )
  }
}