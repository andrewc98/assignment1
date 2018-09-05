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

  getGroups(user_name) {
    return this.http.get('http://localhost:3000/api/dash');
  }
}
