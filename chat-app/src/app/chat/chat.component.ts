import { Component, OnInit } from '@angular/core';
import { SocketService } from '../socket.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  username: String;
  messages = []
  message;
  connection
  constructor(private sockServer: SocketService, private router:Router) { }

  ngOnInit() {
    if(!sessionStorage.getItem("username")){
      console.log("there is no username");
      this.router.navigateByUrl("home");
    } else {
      this.username = sessionStorage.getItem("username");
    }

    this.connection = this.sockServer.getMessage().subscribe(message=>{
      this.messages.push(message);
      this.message = '';
    });
  }
  sendMessage(){
    let data = '[' + this.username + ']' + this.message;
    this.sockServer.sendMessage(data);
  }

  ngOnDestroy(){
    if (this.connection) {
      this.connection.unsubscribe();
    }
  }
  logOut(){
    this.ngOnDestroy();
    sessionStorage.clear();
    this.router.navigateByUrl('home');
  }

}
