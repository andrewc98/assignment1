import { Injectable } from '@angular/core';
import { Observable, observable } from 'rxjs';
import * as io from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})

export class SocketService {
  private url = 'http://localhost:3000';
  private socket;
  constructor() { }

  sendMessage (message) {
    console.log('sendMessage(' + message + ')');
    this.socket.emit('add-message', message);
  }

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
}
