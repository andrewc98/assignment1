import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})

export class UsersService {

  constructor(private http:HttpClient) {}

  /*
    Author -------- Andrew Campbell
    Date ---------- 05/09/2018
    Description --- This function uses the http to access the node server to get the users from the json file.
  */
  getUsers() {
    console.log("getUsersJSON");
    return this.http.get('http://localhost:3000/api/users');
  }

  /*
    Author -------- Andrew Campbell
    Date ---------- 05/09/2018
    Description --- This function uses the http to access the node server to create a new user in the json file.
  */
  createUser(user) {
    return this.http.post('http://localhost:3000/api/users/', user, httpOptions);
  }

  /*
    Author -------- Andrew Campbell
    Date ---------- 05/09/2018
    Description --- This function uses the http to access the node server to delete a user from the json file.
  */
  deleteUser(user) {
    return this.http.delete('http://localhost:3000/api/users/' + user.user_name);
  }

  /*
    Author -------- Andrew Campbell
    Date ---------- 05/09/2018
    Description --- This function uses the http to access the node server to change the access_level of a user.
  */
  changeLevel(user, level) {
    let body = [user, level]
    console.log(body);
    return this.http.put('http://localhost:3000/api/users/' + user.user_name, body, httpOptions);
  }
}