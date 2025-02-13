 import { HttpClient } from '@angular/common/http'
 import { Injectable, inject} from '@angular/core'
 import { User } from '@model/users.model'
 import { environment } from "@environments/environment.development"


 @Injectable({
     providedIn: 'root'
 })
 export class UsersService {

     private http = inject(HttpClient)
     private readonly endPoint = environment.API_URL

     constructor() { }
     //--------------------------------------------------------------------------------------------

     getUsers() {

         return this.http.get<User[]>(`${this.endPoint}/users`)
     }

     //--------------------------------------------------------------------------------------------

     getUser(id: number) {

         return this.http.get<User>(`${this.endPoint}/users/${id}`)

     }

     //--------------------------------------------------------------------------------------------
  }
