import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChatComponent } from './chat/chat.component';
import { LoginComponent} from './login/login.component';
import { ManageUserComponent } from './manage-user/manage-user.component';
import { ManageChannelsComponent } from './manage-channels/manage-channels.component';
import { ManageGroupsComponent } from './manage-groups/manage-groups.component';
import { DashboardComponent } from './dashboard/dashboard.component';


  /*
    Author -------- Andrew Campbell
    Date ---------- 06/09/2018
    Description --- This is the routes that my app uses, and the components they go to.
  */
const routes: Routes = [
  {path:'home', component:LoginComponent},    //Home route
  {path:'', component:LoginComponent},   //Does this work?
  {path:'chat', component:ChatComponent},
  {path:'manage_user', component:ManageUserComponent},
  {path:'manage_channels', component:ManageChannelsComponent},
  {path:'manage_groups', component:ManageGroupsComponent},
  {path:'dashboard', component:DashboardComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
