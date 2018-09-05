import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})

export class GroupsService {

  constructor(private http:HttpClient) { }

  getChannels() {
    return this.http.get('http://localhost:3000/api/groups');
  }

  addChannelToGroup(channel_name, group) {
    console.log("addChannelToGroupJSON");
    let body = [channel_name, group]
    return this.http.put('http://localhost:3000/api/groups/' + group.group_name, body, httpOptions);
  }
}
