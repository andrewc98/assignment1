import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})

export class ChannelsService {

  constructor(private http:HttpClient) { }

  /*
    Author -------- Andrew Campbell
    Date ---------- 05/09/2018
    Description --- This function uses the http to access the node server to get the channels from the json files.
  */
  getChannels() {
    console.log("getChannelsJSON");
    return this.http.get('http://localhost:3000/api/channels');
  }

  /*
    Author -------- Andrew Campbell
    Date ---------- 05/09/2018
    Description --- This function uses the http to access the node server to add a new channel to the json file
  */
  createChannel(channel) {
    return this.http.post('http://localhost:3000/api/channels/', channel, httpOptions);
  }

  /*
    Author -------- Andrew Campbell
    Date ---------- 06/09/2018
    Description --- This function uses the http to access the node server to add a existing user to the json file.
  */
  addUserToChannel(channel, user){
    let body = [channel, user]
    return this.http.put('http://localhost:3000/api/channels/' + channel.name, body, httpOptions);
  }

  /*
    Author -------- Andrew Campbell
    Date ---------- 05/09/2018
    Description --- This function uses the http to access the node server to delete a channel, and it's connections.
  */
  deleteChannel(channel) {
    return this.http.delete('http://localhost:3000/api/channels/' + channel.channel_name);
  }
}
