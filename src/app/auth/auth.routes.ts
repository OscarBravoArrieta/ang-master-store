 import { Routes } from '@angular/router'
 import { authGuard } from '@guards/auth.guard'
 import { hasRoleGuard } from '@guards/has-role.guard'

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
