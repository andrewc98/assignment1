import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class UsersService {
  public knownusers = [
    {
      name: "Super",
      email: "admin@gmail.com",
      channels: ["Sport", "Business"]
    },
    {
      name: "Group",
      email: "jordan@gmail.com",
      channels: ["Cooking", "Business"]
    }
  ];
  constructor() { }

  getUserJSON(){

  }
}