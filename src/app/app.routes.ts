 import { Routes } from '@angular/router'
 import { LayoutComponent } from '@layout/layout/layout.component'
 import { NotFoundComponent } from '@layout/not-found/not-found.component'

 export const routes: Routes = [
     {
         path: '',
         component: LayoutComponent,
         children: [
             {
                 path: 'dashboard',
                 title: 'Gestionando la tienda',
                 loadComponent: () => import ('@dashboard/dashboard/dashboard.component')

             },
             {
                 path: 'admin-products-list',
                 title: 'Administración de productos',
                 loadComponent: () => import ('@admin/products/products-list/products-list.component')
             },
             {
                 path: 'admin-categories-list',
                 title: 'Administración de categorías',
                 loadComponent: () => import ('@admin/categories/categories-list/categories-list.component')
             },
             {
                 path: 'admin-user-list',
                 title: 'Listado de usuarios',
                 loadComponent: () => import ('@admin/users/users-list/users-list.component')
             },
             {
                 path: 'admin-file-interface',
                 title: 'Interface de archivos',
                 loadComponent: () => import ('@file-interface/extract-from-json/extract-from-json.component')


             },
            //  {
            //      path: 'auth-login',
            //      title: 'Login',
            //      loadComponent: () => import ('@auth/login/login.component')
            //  },
             {
                 path: 'auth-register',
                 title: 'Crear cuenta',
                 loadComponent: () => import ('@auth/register/register.component')
             },
             {
                 path: 'auth-profile',
                 title: 'User profile',
                 loadComponent: () => import ('@auth/profile/profile.component')
            },
         ]
     },
     {
         path:'**',
         component: NotFoundComponent
    }

 ]
