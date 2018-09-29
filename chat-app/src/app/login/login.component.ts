import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UsersService } from '../users.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public username: string;
  public password: string;
  public users;
  constructor(private router:Router, private form:FormsModule, private _userService: UsersService) { }

  /*
    Author -------- Andrew Campbell
    Description --- This function is used to determine if the user has logged in, if they have, redirect.
  */
  ngOnInit() {
    if(sessionStorage.getItem("username")){
      this.router.navigateByUrl("dashboard");
    } else {
      this.getUsers();
    }
  }

  /*
    Author -------- Andrew Campbell
    Description --- This will call the userService for all of the users.
  */
  getUsers() {
    console.log("getUsers");
    this._userService.getUsers().subscribe(
      data => { this.users = data },
      err => console.error(err),
      () => console.log('Found Users')
    );
    sessionStorage.setItem("users", this.users)
  }

  /*
    Author ------- Andrew Campbell
    Description -- This function will login the user, and redirect them to the dashboard, only if they are a registered user.
  */
  loginUser(event){
    if (typeof(Storage) !== "undefined") {
      for (let user of this.users) {
        if (user.name == this.username && user.password == this.password) {
          sessionStorage.setItem("username", this.username);
          sessionStorage.setItem("access_level", user.access_level);
          this.router.navigate(['/dashboard']);
        }
      }
    }
  }
}