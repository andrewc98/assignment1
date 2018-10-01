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

  /*
    Author -------- Andrew Campbell
    Date ---------- 05/09/2018
    Description --- This function will check if the user is of high enough rank to be on this page, or even if they are logged in.
  */
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


  /*
    Author -------- Andrew Campbell
    Date ---------- 05/09/2018
    Description --- This function will call the groupService for the groups.json.
  */
  getGroups(){
    console.log("getGroups");
    this._groupService.getGroups().subscribe(
      data => { this.groups = data },
      err => console.error(err),
      () => console.log('Found Groups')
    );
  }


  /*
    Author -------- Andrew Campbell
    Date ---------- 01/10/2018
    Description --- This function calls the groupService function to add a user or channel to the group.
  */
  addToGroup(channel_name, group, type) {
    if (channel_name != "" && group && type && (group.admin.indexOf(sessionStorage.getItem("username")) != -1 || sessionStorage.getItem("access_level") == "3")) {
      console.log("addToGroup");
      this._groupService.addToGroup(channel_name, group, type).subscribe(
        data => { this.groups = data },
        err => console.error(err),
        () => console.log('Added To Group')
      )
    } else {
      alert("Sorry, you cannot do that")
    }
  }

  /*
    Author ------- Andrew Campbell
    Date --------- 06/09/2018
    Description -- This function is used to create a new group.
  */
  createGroup(group_name){
    let groups_name = this.groups.filter(x => x.name == group_name);
    console.log(groups_name);
    if (group_name && groups_name.length == 0) {
      let body = {
        group_name: group_name,
        channels: [],
        admins: []
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
    } else if(groups_name.length != 0) {
      alert("That group already exists.");
    } else {
      alert("Sorry, that input is bad");
    }
  }


  /*
    Author -------- Andrew Campbell
    Date ---------- 06/09/2018
    Description --- This function deletes a group.
  */
  deleteGroup(group){
    if (group) {
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
}