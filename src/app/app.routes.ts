
 import { Routes } from '@angular/router'
 import { LayoutComponent } from '@layout/layout/layout.component'
 import { NotFoundComponent } from '@layout/not-found/not-found.component'
 import { UnauthorizedComponent } from '@layout/unauthorized/unauthorized.component'
 import { authGuard } from '@guards/auth.guard'
 import { hasRoleGuard } from '@guards/has-role.guard'

 export const routes: Routes = [
     {
         path: '',
         title: 'Página inicial',
         component: LayoutComponent,
         children: [
             {
                 canMatch: [authGuard],
                 canActivate: [hasRoleGuard],
                 data: {roles: ['customer']},
                 path: 'dashboard',
                 title: 'Gestionando la tienda',
                 loadComponent: () => import ('@dashboard/dashboard/dashboard.component'),
             },
             {
                 canMatch: [authGuard],
                 canActivate: [hasRoleGuard],
                 data: {roles: ['admin']},
                 path: 'admin-products-list',
                 title: 'Administración de productos',
                 loadComponent: () => import ('@admin/products/products-list/products-list.component'),
             },
             {
                 canMatch: [authGuard],
                 canActivate: [hasRoleGuard],
                 data: {roles: ['admin']},
                 path: 'admin-categories-list',
                 title: 'Administración de categorías',
                 loadComponent: () => import ('@admin/categories/categories-list/categories-list.component'),
             },
             {
                 canMatch: [authGuard],
                 canActivate: [hasRoleGuard],
                 data: {roles: ['admin']},
                 path: 'admin-user-list',
                 title: 'Listado de usuarios',
                 loadComponent: () => import ('@admin/users/users-list/users-list.component'),
             },
             {
                 canMatch: [authGuard],
                 canActivate: [hasRoleGuard],
                 data: {roles: ['admin']},
                 path: 'admin-file-interface',
                 title: 'Interface de archivos',
                 loadComponent: () => import ('@file-interface/extract-from-json/extract-from-json.component'),
             },
             {

                 path: 'auth-login',
                 title: 'Control de acceso',
                 loadComponent: () => import ('@auth/login/login.component')
             },
             {
                 path: 'auth-register',
                 title: 'Crear cuenta',
                 loadComponent: () => import ('@auth/register/register.component')
             },
             {
                 canMatch: [authGuard],
                 canActivate: [hasRoleGuard],
                 data: {roles: ['admin', 'customer']},
                 path: 'auth-profile',
                 title: 'Perfil del usuario',
                 loadComponent: () => import ('@auth/profile/profile.component'),
             },
             {
                 canMatch: [authGuard],
                 canActivate: [hasRoleGuard],
                 data: {roles: ['customer']},
                 path: 'products-in-cart',
                 title: 'Productos en el carrito',
                 loadComponent: () => import ('@shared/cart/cart.component'),

             }
         ]
     },
     {
         path: 'unauthorized',
         title: 'No autorizado',
         component: UnauthorizedComponent

     },
     {
         path:'**',
         component: NotFoundComponent
     },


 ]
