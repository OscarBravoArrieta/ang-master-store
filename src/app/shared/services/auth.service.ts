 import { inject, Injectable, signal, } from '@angular/core'
 import { HttpClient } from '@angular/common/http'
 import { environment } from '@environments/environment'
 import { UserToLog, Token, User } from '@model/users.model'
 import { LocalStorageService } from '@services/local-storage.service'
 import { TokenService } from '@services/token.service'
 import { switchMap, tap } from 'rxjs/operators'
 import { Router } from '@angular/router';

 @Injectable({
     providedIn: 'root'
 })
 export class AuthService {
     private http = inject(HttpClient)
     private localStorageService = inject(LocalStorageService)
     private tokenService = inject(TokenService)
     private router = inject(Router)
     private readonly endPoint = environment.API_URL

     currentUserProfile = signal<User | null>(null)


     constructor() { }

     //--------------------------------------------------------------------------------------------

     logIn(user: UserToLog) {

         return this.http.post<Token>(
             `${this.endPoint}/auth/login`, user
         )
         .pipe(
             tap(response => {
                 this.tokenService.saveToken(response)
             })
         ).pipe(
             switchMap(() => this.getProfile())
        )

     }
     //---------------------------------------------------------------------------------------------

     isLogged() {

         if(this.localStorageService.getItem('token')) {
             return true
         } else {
             return false
         }

     }

     // -----------------------------------------------------------------------------------------------

     getProfile() {

         const token: Token | null = this.tokenService.getToken()
         const access_token: string | null = token ? token.access_token : null

         return this.http.get<User>(

             `${this.endPoint}/auth/profile`,
             {headers:{"Authorization": `Bearer ${access_token}`}}

         ).pipe(
             tap(currentUserProfile => {
                 this.currentUserProfile.set(currentUserProfile)
             }
            )
         )

     }

     // -------------------------------------------------------------------------------------------

     getRole() {

         return this.currentUserProfile()?.role

     }

     //--------------------------------------------------------------------------------------------

     logOut() {

         this.localStorageService.removeItem("token")
         this.router.navigate(['auth-login'])
         .then(() => {
             window.location.reload()
         })

     }

     // -----------------------------------------------------------------------------------------------

 }
