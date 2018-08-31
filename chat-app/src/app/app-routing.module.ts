import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChatComponent } from './chat/chat.component';
import { LoginComponent} from './login/login.component';
import { ManageUserComponent } from './manage-user/manage-user.component';
import { ManageChannelsComponent } from './manage-channels/manage-channels.component';


const routes: Routes = [
  {path:'home', component:LoginComponent},    //Home route
  {path:'', component:LoginComponent},   //Does this work?
  {path:'chat', component:ChatComponent},
  {path:'manage_user', component:ManageUserComponent},
  {path:'manage_channels', component:ManageChannelsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
