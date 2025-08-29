 import { inject, signal } from '@angular/core'
 import { CanMatchFn, GuardResult, MaybeAsync, Router } from '@angular/router';
 import { User } from 'app/core/models/users.model'
 import { AuthService } from 'app/core/services/auth.service'
 import { map } from 'rxjs';

 export const authGuard: CanMatchFn = (route, segments):MaybeAsync<GuardResult> => {

     const authService = inject(AuthService)
     const router = inject(Router)

     if(!authService.isLogged()){
         router.navigate(['/auth-login'])
         return false
     }else{

         return true
     }

 }
