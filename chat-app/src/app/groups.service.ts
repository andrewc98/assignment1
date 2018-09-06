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

  /*
    Author -------- Andrew Campbell
    Date ---------- 05/09/2018
    Description --- This function uses the http to access the node server to get the json.
  */
  getGroups() {
    console.log("getGroupsJSON");
    return this.http.get('http://localhost:3000/api/groups');
  }

  /*
    Author -------- Andrew Campbell
    Date ---------- 05/09/2018
    Description --- This function uses the http to access the node server to add a user or channel to the json.
  */
  addToGroup(channel_name, group, type) {
    console.log("addToGroupJSON");
    let body = [channel_name, group, type]
    return this.http.put('http://localhost:3000/api/groups/' + group.group_name, body, httpOptions);
  }

  /*
    Author -------- Andrew Campbell
    Date ---------- 05/09/2018
    Description --- This function uses the http to access the node server to create a new group in the json.
  */
  createGroups(group) {
    console.log("createGroupJSON");
    return this.http.post('http://localhost:3000/api/groups/', group, httpOptions);
  }

  /*
    Author -------- Andrew Campbell
    Date ---------- 05/09/2018
    Description --- This function uses the http to access the node server to delete a group from the json.
  */
  deleteGroup(group) {
    return this.http.delete('http://localhost:3000/api/groups/' + group.group_name);
  }
}
