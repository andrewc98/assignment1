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


  /*
    Author -------- Andrew Campbell
    Description --- This function will initiate the socket and check if the user is logged in. If they're not logged in, they're redirected.
  */
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

  /*
    Author -------- Andrew Campbell
    Description --- This function is used to send a message through the socket.
  */
  sendMessage(){
    
    let data = { channel: sessionStorage.getItem("chat_channel"), message: '[' + this.username + ']' + this.message}
    this.sockServer.sendMessage(data);
  }

  /*
    Author -------- Andrew Campbell
    Description --- This function is called to end the socket connection.
  */
  ngOnDestroy(){
    if (this.connection) {
      this.connection.unsubscribe();
    }
  }

  /*
    Author -------- Andrew Campbell
    Description --- Farily null now.
  */
  logOut(){
    this.ngOnDestroy();
    sessionStorage.clear();
    this.router.navigateByUrl('home');
  }

}
