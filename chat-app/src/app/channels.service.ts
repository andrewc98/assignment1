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

  getChannels() {
    console.log("getChannelsJSON");
    return this.http.get('http://localhost:3000/api/channels');
  }

  createChannel(channel_name) {
    return this.http.post('http://localhost:3000/api/channels/', channel_name, httpOptions);
  }

  addUserToChannel(channel, user){
    let body = [channel, user]
    return this.http.put('http://localhost:3000/api/channels/' + channel.name, body, httpOptions);
  }

  deleteChannel(channel) {
    return this.http.delete('http://localhost:3000/api/channels/' + channel.channel_name);
  }
}
