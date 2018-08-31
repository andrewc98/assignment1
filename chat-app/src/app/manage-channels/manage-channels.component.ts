import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-manage-channels',
  templateUrl: './manage-channels.component.html',
  styleUrls: ['./manage-channels.component.css']
})
export class ManageChannelsComponent implements OnInit {

  constructor(private router:Router) { }

  ngOnInit() {
    if(!sessionStorage.getItem("username")){
      console.log("there is no username");
      this.router.navigateByUrl("home");
    }
  }
}
