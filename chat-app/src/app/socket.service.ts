import { Injectable } from '@angular/core';
import { Observable, observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as io from 'socket.io-client';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})

export class SocketService {

  constructor(private http:HttpClient) { }
  private url = 'http://localhost:3000';
  private socket;


  /*
    Author -------- Andrew Campbell
    Description --- This function will send a message through the socket.
  */
  sendMessage (channel, message) {
    this.socket = io(this.url);    
    console.log('sendMessage(' + message + ')');
    this.socket.emit('add-message', message, channel);
  }

  /*
    Author -------- Andrew Campbell
    Description --- This will recieve messages from the socket.
  */
  getMessage () {
    this.socket = io(this.url);    
    console.log('getMessages');
    let observable = new Observable(observer => {
      this.socket.on('message', (data)=>{
        observer.next(data);
        return()=>{
          this.socket.disconnect();
        }
      });
    });
    return observable;
  }


  /*
    Author -------- Andrew Campbell
    Date ---------- 01/10/2018
    Description --- This will retrieve the messages from the chat collection in MongoDB.
  */
  getDBMessages(channel) {
    console.log("getDBMessages");
    return this.http.get('http://localhost:3000/api/chat/', {params: {name: channel}});
  }
}
