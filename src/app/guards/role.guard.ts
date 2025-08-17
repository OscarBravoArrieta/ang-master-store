 import { inject } from '@angular/core';
 import { CanActivateFn, Router } from '@angular/router'
 import { AuthService } from '@services/auth.service'

 export const roleGuard: CanActivateFn = (route, state) => {

     const authService = inject(AuthService)
     const currentUserProfile = authService.currentUserProfile

     if(currentUserProfile()?.role == 'admin') {
         return true
     } else {
         return false
     }

 }
