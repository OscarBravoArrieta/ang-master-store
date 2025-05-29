 import { HttpClient, HttpHeaders } from '@angular/common/http'
 import { Injectable, inject} from '@angular/core'
 import { User, UserToUpdate } from '@model/users.model'
 import { environment } from "@environments/environment.development"


 @Injectable({
     providedIn: 'root'
 })
 export class UsersService {

     private http = inject(HttpClient)
     private readonly endPoint = environment.API_URL

     httpOptions = {
         headers: new HttpHeaders({
             'Access-Control-Allow-Origin':  '*',
             'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE',
             'Access-Control-Allow-Headers': 'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With'
         }
     )}

     constructor() { }
     //--------------------------------------------------------------------------------------------

     getUsers() {

         return this.http.get<User[]>(`${this.endPoint}/users`, this.httpOptions)
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
     async uploadAvatar(file: any){
         const formData = new FormData();
         formData.append("file", file);
         const response = await fetch(`${this.endPoint}/files/upload`, {
             method: "POST",
             body: formData,
         })

         return response.json()

     }

     //--------------------------------------------------------------------------------------------
 }
