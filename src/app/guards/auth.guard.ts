 import { inject, signal } from '@angular/core'
 import { CanMatchFn, GuardResult, MaybeAsync, Router } from '@angular/router';
 import { User } from '@model/users.model'
 import { AuthService } from '@services/auth.service'
 import { map } from 'rxjs';

 export const authGuard: CanMatchFn = (route, segments):MaybeAsync<GuardResult> => {

     const authService = inject(AuthService)
     const router = inject(Router)
     console.log('Autenticated...', authService.isLogged())

     if(!authService.isLogged()){
         router.navigate(['/auth-login'])
         return false
     }else{

         return true
     }




    //  console.log('autenticated...', authService.isLogged())


    //  if(authService.isLogged()){
    //      console.log('autenticated...', authService.isLogged())
    //      return inject(AuthService).getProfile().pipe(
    //      map((user: User) => {
    //          if(user) return true

    //          router.navigate(['/auth-login'])
    //          return false
    //      })
    //     )
    //  }
    //  console.log('asdfasdf...')
    //  router.navigate(['/auth-login'])
    //  return false
 }
