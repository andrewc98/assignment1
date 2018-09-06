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
    } else if(sessionStorage.getItem("access_level") == "1"){
      console.log(sessionStorage.getItem("access_level"));
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

  addToGroup(channel_name, group, type) {
    console.log("addToGroup");
    this._groupService.addToGroup(channel_name, group, type).subscribe(
      data => { this.groups = data },
      err => console.error(err),
      () => console.log('Added To Group')
    )
  }

  /*
    Author ------- Andrew Campbell
    Date --------- 05/09/2018
    Description -- This function is used to create a new group.
  */
  createGroup(group_name){
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

  deleteGroup(group){
    this._groupService.deleteGroup(group).subscribe(
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