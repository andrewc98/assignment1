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

  /*
    Author -------- Andrew Campbell
    Date ---------- 31/09/2018
    Description --- This function will determine if the user should be here.
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
      this.getUsers();
    }
  }

  /*
    Author -------- Andrew Campbell
    Date ---------- 31/09/2018
    Description --- This will call the userService service to access the node server to get the json file.
  */
  getUsers() {
    console.log("getUsers");
    this._userService.getUsers().subscribe(
      data => { this.users = data },
      err => console.error(err),
      () => console.log('Found Users')
    );
  }

  /*
    Author ------- Andrew Campbell
    Date --------- 02/09/2018
    Description -- This function will delete a user from the JSON files.
  */
  deleteUser(user){
    if (sessionStorage.getItem("access_level") == '3' && sessionStorage.getItem("username") != user.user_name) {
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

  /*
    Author -------- Andrew Campbell
    Date ---------- 31/09/2018
    Description --- This will determine if the user is allowed to change the access_level of a user and call the userService to do it.
  */
  changeLevel(user, access_level) {
    if (((user.access_level != '3' && access_level == '+') || (user.access_level != '1' && access_level == '-')) && 
        !(user.access_level == '2' && access_level == '+' && sessionStorage.getItem("access_level") == "2") && 
        !(user.access_level == '3' && access_level == '-' && sessionStorage.getItem("access_level") == "2") &&
         (sessionStorage.getItem("username") != user.user_name)) {
      console.log("changeLevel");
      this._userService.changeLevel(user, access_level).subscribe(
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
}