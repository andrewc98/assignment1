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

  ngOnInit() {
    if(!sessionStorage.getItem("username")){
      console.log("No Username found.");
      this.router.navigateByUrl("home");
    } else {
      console.log("ngOnInit");
      this.getChannels();
    }
  }

  getChannels() {
    console.log("getChannels");
    this._channelService.getChannels().subscribe(
      data => { this.channels = data },
      err => console.error(err),
      () => console.log('Found Users')
    );
    this.channels.reverse()
  }

  addUserToChannel(channel, user) {
    console.log("addUserToChannel");
    this._channelService.addUserToChannel(channel, user).subscribe(
      data => { this.channels = data },
      err => console.error(err),
      () => console.log('Found Channels')
    );
  }

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
  event.preventDefault();
  this._channelService.createChannel(channel_name).subscribe(
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