import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})

export class DashInterfaceService {

  constructor(private http:HttpClient) { }

  getGroups(user_name, access_level) {
    return this.http.get('http://localhost:3000/api/dash', {params: {name: user_name, access_level: access_level}});
  }
}