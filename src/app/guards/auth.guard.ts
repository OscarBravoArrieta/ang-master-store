 import { inject } from '@angular/core'
 import { CanMatchFn, GuardResult, MaybeAsync, Router } from '@angular/router';
 import { User } from '@model/users.model'
 import { AuthService } from '@services/auth.service'
 import { map } from 'rxjs'

 export const authGuard: CanMatchFn = (route, segments):MaybeAsync<GuardResult> => {

     const router = inject(Router)
     return inject(AuthService).getProfile().pipe(
         map((user: User) => {
             if(user) return true
             router.createUrlTree(['/auth-login'])
             return false
         })
     )

 }
