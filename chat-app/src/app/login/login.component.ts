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
  public knownusers = ["Super", "Group"];
  constructor(private router:Router, private form:FormsModule, private userService: UsersService) { }

  ngOnInit() {
    this.userService.getUserJSON();
  }

  /*
    Author ------- Andrew Campbell
    Date --------- 31/08/2018
    Description -- This function will login the user, and redirect them to chat, only if they are a registered user.
  */
  loginUser(event){
    event.preventDefault();
    if (typeof(Storage) !== "undefined") {
      if (this.knownusers.indexOf(this.username) != -1 || this.username == "") {
        sessionStorage.setItem("username", this.username);
        this.router.navigate(['/chat']);
      }
    }
  }
}
