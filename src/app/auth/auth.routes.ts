 import { Routes } from '@angular/router'
 import { authGuard } from 'app/core/guards/auth.guard'
 import { hasRoleGuard } from 'app/core/guards/has-role.guard'

 export default [

     {
         path: 'auth-login',
         title: 'Control de acceso',
         loadComponent: () => import ('@auth/login/login.component')
     },
     {
         canMatch: [authGuard],
         canActivate: [hasRoleGuard],
         data: {roles: ['customer', 'admin']},
         path: 'auth-profile',
         title: 'Perfil del usuario',
         loadComponent: () => import ('@auth/profile/profile.component'),
     },

 ] as Routes
