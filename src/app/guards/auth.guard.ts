import { tap } from 'rxjs/operators';


 import { inject, Injectable } from '@angular/core'
 import { CanActivateFn, Router} from '@angular/router'
 import { AuthService } from '@services/auth.service'

 export function authGuard(role: string): CanActivateFn {

 return () => {

     const authService = inject(AuthService)
     const router = inject(Router)

     if ((!authService.isLogged())){

         router.navigate(['/auth-login'])
         return false

     }

     if (authService.getRole() === role) {

         return true

     } else {

         router.navigate(['unauthorized'])
         return false

     }
  }
}

//https://www.youtube.com/watch?v=5vyKqkkX44c
//Cómo crear y usar AuthGuards en Angular 19 | canActivate | canActivateChild | resolve
