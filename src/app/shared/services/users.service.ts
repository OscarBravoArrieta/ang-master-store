 import { HttpClient } from '@angular/common/http'
 import { Injectable, inject} from '@angular/core'
 import { User, UserToUpdate } from '@model/users.model'
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

     createUser(user: User) {

         return this.http.post<User>(`${this.endPoint}/users/`, user)

     }


     //--------------------------------------------------------------------------------------------

     updateUser(id: number | undefined, data: UserToUpdate){

         return this.http.put<User>(`${this.endPoint}/users/${id}`, data)

     }

     //--------------------------------------------------------------------------------------------
 }
