import { Component, OnInit } from '@angular/core';
import { UsersService } from '../users.service';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-manage-user',
  templateUrl: './manage-user.component.html',
  styleUrls: ['./manage-user.component.css']
})
export class ManageUserComponent implements OnInit {

  public users;
  public nameUser: string;
  public nameEmail: string;
  constructor(private userDetails: UsersService, private router:Router) { }

  ngOnInit() {
    console.log("HERER!");
    // this.users = this.userDetails.knownusers;
    // if(!sessionStorage.getItem("username")){
    //   console.log("there is no username");
    //   this.router.navigateByUrl("home");
    // }
    
    if(!sessionStorage.getItem("username")){
      console.log("No Username found.");
      this.router.navigateByUrl("home");
    } else {
      console.log("0");
      this.getUsers();
      console.log(this.users);
    }
  }

  getUsers() {
    console.log("1");
    this.userDetails.getUsersJSON().subscribe(
      data => { this.users = data},
      err => console.error(err),
      () => console.log('Found Users')
    );
  }

  /*
    Author ------- Andrew Campbell
    Date --------- 02/09/2018
    Description -- This function will create a new user based on the input of the form.
  */
  createUser(event) {
    // event.preventDefault();
    // this.userDetails.knownusers.push({
    //   name: this.nameUser,
    //   email: this.nameEmail,
    //   channels: ["Pow"] //This is just a placeholder
    // });
  }

}
