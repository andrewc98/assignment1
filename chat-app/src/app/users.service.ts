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

  getUsers() {
    console.log("getUsersJSON");
    return this.http.get('http://localhost:3000/api/users');
  }

  createUser(user) {
    return this.http.post('http://localhost:3000/api/users/', user, httpOptions);
  }

  deleteUser(user) {
    return this.http.delete('http://localhost:3000/api/users/' + user.user_name);
  }

  changeLevel(user, level) {
    let body = [user, level]
    console.log(body);
    return this.http.put('http://localhost:3000/api/users/' + user.user_name, body, httpOptions);
  }
}