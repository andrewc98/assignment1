import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-manage-channels',
  templateUrl: './manage-channels.component.html',
  styleUrls: ['./manage-channels.component.css']
})
export class ManageChannelsComponent implements OnInit {
  
  public channels = [{
    name: "Stories",
    users: ["Jack", "Jill"]
  },{
    name: "Cooking",
    users: ["Robin", "Huey"]
  }];

  constructor(private router:Router) { }

  ngOnInit() {
    if(!sessionStorage.getItem("username")){
      console.log("there is no username");
      this.router.navigateByUrl("home");
    }
  }

  /*
    Author ------- Andrew Campbell
    Date --------- 31/08/2018
    Description -- This function will login the user, and redirect them to chat, only if they are a registered user.
  */
 loginUser(event){
  event.preventDefault();
  
  }
}