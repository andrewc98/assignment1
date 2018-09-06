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

  getGroups() {
    console.log("getGroupsJSON");
    return this.http.get('http://localhost:3000/api/groups');
  }

  addToGroup(channel_name, group, type) {
    console.log("addChannelToGroupJSON");
    let body = [channel_name, group, type]
    return this.http.put('http://localhost:3000/api/groups/' + group.group_name, body, httpOptions);
  }

  createGroups(group) {
    console.log("createGroupJSON");
    return this.http.post('http://localhost:3000/api/groups/', group, httpOptions);
  }

  deleteGroup(group) {
    return this.http.delete('http://localhost:3000/api/groups/' + group.group_name);
  }
}
