import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { ChatComponent } from './chat/chat.component';
import { ManageUserComponent } from './manage-user/manage-user.component';
import { ManageChannelsComponent } from './manage-channels/manage-channels.component';
import { ManageGroupsComponent } from './manage-groups/manage-groups.component';
import { UsersService } from './users.service';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ChatComponent,
    ManageUserComponent,
    ManageChannelsComponent,
    ManageGroupsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
