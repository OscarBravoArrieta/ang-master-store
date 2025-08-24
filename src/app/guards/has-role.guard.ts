 import { User } from '@model/users.model'
 import { inject } from '@angular/core'
 import { CanActivateFn, Router } from '@angular/router'
 import { AuthService } from '@services/auth.service'
 import { map } from 'rxjs'



 export const hasRoleGuard: CanActivateFn = (route, state) => {

     const router = inject(Router)
     const authService = inject(AuthService)
     const roles = route.data?.['roles'] as string[]
     console.log('Roles: ',  roles )

     if(!authService.isLogged()) return false

     return inject(AuthService).getProfile().pipe(
         map((user: User) => {
             if(!user) return false

             if(!roles.includes(user.role!)){
                 router.navigate(['unauthorized'])
                 return false
             }
             return roles.includes(user.role!)
         })
     )
 }
