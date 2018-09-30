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
  messages = [];
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
    }
    this.username = sessionStorage.getItem("username");

    if (this.messages.length == 0) {
      var messages_to_add;
      this.sockServer.getDBMessages(sessionStorage.getItem("chat_channel")).subscribe(
        data => { messages_to_add = data },
        err => console.error(err),
        () => appendChat(messages_to_add, this.sockServer, this.messages)
      );
    } else {
      
    }

    function appendChat(messages_to_add, sockServer, messages) {
      console.log(messages_to_add + ": This line");
      console.log(messages_to_add);

      if (messages_to_add !== undefined) {
        console.log(messages_to_add["messages"]);
        messages_to_add["messages"].forEach(mess => {
          console.log(mess);
          this.messages.push(mess);
        });
      }
      this.sockServer.sendMessage(sessionStorage.getItem("chat_channel"), sessionStorage.getItem("username") + " joined the chat.");
      connectChat();
    }

    function connectChat() {
      this.connection = this.sockServer.getMessage().subscribe(message=>{
        if (message["text"][1] == sessionStorage.getItem("chat_channel")) {
          this.messages.push(message["text"][0]);
        }
        this.message = '';
      });
    }
  }

  /*
    Author -------- Andrew Campbell
    Description --- This function is used to send a message through the socket.
  */
  sendMessage(){
    let data = '[' + this.username + ']' + this.message;
    this.sockServer.sendMessage(sessionStorage.getItem("chat_channel"), data);
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
