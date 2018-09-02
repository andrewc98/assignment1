import { Component, OnInit } from '@angular/core';
import { UsersService } from '../users.service';

@Component({
  selector: 'app-manage-user',
  templateUrl: './manage-user.component.html',
  styleUrls: ['./manage-user.component.css']
})
export class ManageUserComponent implements OnInit {

  public users: Array<any>;

  constructor(private userDetails: UsersService) { }

  ngOnInit() {
    this.users = this.userDetails.knownusers;
  }

}
