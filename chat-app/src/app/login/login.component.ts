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
  public users;
  constructor(private router:Router, private form:FormsModule, private _userService: UsersService) { }

  ngOnInit() {
    if(sessionStorage.getItem("username")){
      this.router.navigateByUrl("dashboard");
    } else {
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

  /*
    Author ------- Andrew Campbell
    Date --------- 31/08/2018
    Description -- This function will login the user, and redirect them to the dashboard, only if they are a registered user.
  */
  loginUser(event){
    if (typeof(Storage) !== "undefined") {
      for (let name of this.users) {
        if (name.user_name == this.username) {
          sessionStorage.setItem("username", this.username);
          sessionStorage.setItem("access_level", name.access_level);
          this.router.navigate(['/dashboard']);
        }
      }
    }
  }
}