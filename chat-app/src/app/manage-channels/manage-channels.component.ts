import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChannelsService } from '../channels.service';

@Component({
  selector: 'app-manage-channels',
  templateUrl: './manage-channels.component.html',
  styleUrls: ['./manage-channels.component.css']
})
export class ManageChannelsComponent implements OnInit {
  public channels;
  public channelName: string;
  public nameUser: string;
  public nameEmail: string;
  constructor(private router:Router, private _channelService: ChannelsService) { }

  /*
    Author -------- Andrew Campbell
    Date ---------- 31/09/2018
    Description --- This function is used to determine if the user should be here, and to call getChannels.
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
      this.getChannels();
    }
  }

  /*
    Author -------- Andrew Campbell
    Date ---------- 05/09/2018
    Description --- This function calls the channelService service to access the channels.
  */
  getChannels() {
    console.log("getChannels");
    this._channelService.getChannels().subscribe(
      data => { this.channels = data },
      err => console.error(err),
      () => console.log('Found Groups')
    );
  }

  /*
    Author -------- Andrew Campbell
    Date ---------- 05/09/2018
    Description --- This function calls the channelService service to add a user to the channel.
  */
  addUserToChannel(channel, user) {
    if (channel && user) {
      console.log("addUserToChannel");
      this._channelService.addUserToChannel(channel, user).subscribe(
        data => { this.channels = data },
        err => console.error(err),
        () => console.log('Added User To Channel')
      )
    }
  }

  /*
    Author -------- Andrew Campbell
    Date ---------- 05/09/2018
    Description --- This function calls the channelService service to delete a channel.
  */
  deleteChannel(channel){
    this._channelService.deleteChannel(channel).subscribe(
      data => {
        this.getChannels();
        return true;
      },
      error => {
        console.error(error);
        console.error('Unexpected error encountered deleting channel.');
      }
    )
  }

  /*
    Author ------- Andrew Campbell
    Date --------- 31/08/2018
    Description -- This function will login the user, and redirect them to chat, only if they are a registered user.
  */
  createChannel(channel_name){
    if (channel_name) {
      let body = {
        channel_name: channel_name,
        users: []
      }
      this._channelService.createChannel(body).subscribe(
        data => {
          this.getChannels();
          return true;
        },
        error => {
          console.error(error);
          console.error('Unexpected error encountered creating channel.');
        }
      )
    }
  }
}