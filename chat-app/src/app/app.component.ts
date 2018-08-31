import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  constructor(private router:Router, private form:FormsModule) { }

  /*
    Author ------- Andrew Campbell
    Date --------- 31/08/2018
    Description -- This function will perform three actions.
                -- Prevent the default event.
                -- Remove username from session storage.
                -- Naviagate back to home.
                -- This function is called by clicking on the "Logout" button.
  */
  logoutUser(event){
    event.preventDefault();
    sessionStorage.removeItem("username");
    this.router.navigate(['/home']);
  }
}
