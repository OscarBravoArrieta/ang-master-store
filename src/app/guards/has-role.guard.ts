 import { User } from '@model/users.model'
 import { inject } from '@angular/core'
 import { CanActivateFn, Router } from '@angular/router'
 import { AuthService } from '@services/auth.service'
 import { map } from 'rxjs'



 export const hasRoleGuard: CanActivateFn = (route, state) => {

     const router = inject(Router)
     const roles = route.data?.['roles'] as string[]

     return inject(AuthService).getProfile().pipe(
         map((user: User) => {
             if(!user) return false

             console.log('Rol en cuestión: ',  roles.includes(user.role!) )
             if(!roles.includes(user.role!)){
                 router.navigate(['unauthorized'])
             }
             return roles.includes(user.role!)

         })
     )
 }
