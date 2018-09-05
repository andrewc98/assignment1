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
  constructor(private _userService: UsersService, private router:Router) { }

  ngOnInit() {
    // this.users = this._userService.knownusers;
    // if(!sessionStorage.getItem("username")){
    //   console.log("there is no username");
    //   this.router.navigateByUrl("home");
    // }
    
    if(!sessionStorage.getItem("username")){
      console.log("No Username found.");
      this.router.navigateByUrl("home");
    } else {
      console.log("ngOnInit");
      this.getUsers();
    }
  }

  getUsers() {
    console.log("getUsers");
    this._userService.getUsers().subscribe(
      data => { this.users = data },
      err => console.error(err),
      () => console.log('Found Users')
    );
  }

  deleteUser(user){
    this._userService.deleteUser(user).subscribe(
      data => {
        this.getUsers();
        return true;
      },
      error => {
        console.error(error);
        console.error('Unexpected error encountered deleting user.');
      }
    )
  }

  /*
    Author ------- Andrew Campbell
    Date --------- 02/09/2018
    Description -- This function will create a new user based on the input of the form.
  */
  createUser(name, email) {
    let body = {
      name: name,
      email: email
    }
    this._userService.createUser(body).subscribe(
      data => { 
        this.getUsers();
        return true;
      },
      error => {
        console.error(error);
      }
    )
  }
}