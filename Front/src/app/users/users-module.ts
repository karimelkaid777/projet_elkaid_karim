import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing-module';
import { Login } from './components/login/login';
import { Signup } from './components/signup/signup';
import { UserList } from './components/user-list/user-list';
import { UserService } from './services/user';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    UsersRoutingModule,
    Login,
    Signup,
    UserList
  ],
  providers: [UserService]
})
export class UsersModule { }
