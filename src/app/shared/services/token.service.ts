 import { inject, Injectable } from '@angular/core'
 import { LocalStorageService } from './local-storage.service'
 import { Token } from '@model/users.model'

 @Injectable({
     providedIn: 'root'
 })
 export class TokenService {

     private localStorageService = inject(LocalStorageService)

     constructor() { }

     //--------------------------------------------------------------------------------------------

     saveToken(token: Token) {

         this.localStorageService.setItem('token', token)

     }

     //--------------------------------------------------------------------------------------------

     getToken() {

         const token: Token = this.localStorageService.getItem('token')
         return token

     }

     //--------------------------------------------------------------------------------------------
 }
