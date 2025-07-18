 import { HttpClient, HttpHeaders } from '@angular/common/http'
 import { Injectable, inject} from '@angular/core'
 import { AuthService } from './auth.service'
 import { User, UserToLog, UserToUpdate } from '@model/users.model'
 import { environment } from "@environments/environment.development"
 import { map, switchMap } from 'rxjs'


 @Injectable({
     providedIn: 'root'
 })
 export class UsersService {

     private http = inject(HttpClient)
     private authService = inject(AuthService)
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

     getUserByEmail(email: string, id: number) {

         console.log(email, " - ", id)

         return this.http.get<User[]>(`${this.endPoint}/users`).pipe(
             map(users => users.some(user => user.email === email && user.id !== id) )
         )

     }


     //--------------------------------------------------------------------------------------------

     createUser(user: User) {

         return this.http.post<User>(`${this.endPoint}/users/`, user)

     }


     //--------------------------------------------------------------------------------------------
     createAndLogin (user: User) {

         const userToLog: UserToLog = {
             email: user.email,  //'john@mail.com',
             password: user.password //'changeme'
         }

         return this.createUser(user)
         .pipe(
             switchMap(() => this.authService.logIn(userToLog))
         )
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
