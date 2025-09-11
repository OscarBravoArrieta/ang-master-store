import { Component } from '@angular/core';

 import { Routes } from '@angular/router'
 import { LayoutComponent } from '@layout/layout/layout.component'
 import { NotFoundComponent } from '@layout/not-found/not-found.component'
 import { UnauthorizedComponent } from '@layout/unauthorized/unauthorized.component'

 import { authGuard } from 'app/core/guards/auth.guard'

 export const routes: Routes = [
     {

         path: '',
         title: 'Página inicial',
         component: LayoutComponent,


         children: [
             {
                 path: '',
                 loadChildren: () => import ('@auth/auth.routes')
             },
             {
                 canMatch: [authGuard],
                 path: '',
                 loadChildren: () => import ('@admin/admin.routes')
             },
             {
                 canMatch: [authGuard],
                 path: '',
                 loadChildren: () => import ('@dashboard/dashboard.routes')
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

         ],


     }
 ]
