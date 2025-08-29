
 import { Routes } from '@angular/router'
 import { hasRoleGuard } from 'app/core/guards/has-role.guard'

 export default [
     {
         canActivate: [hasRoleGuard],
         data: {roles: ['admin']},
         path: 'admin-categories-list',
         title: 'Administración de categorías',
         loadComponent: () => import ('@admin/categories/categories-list/categories-list.component'),
     },
     {
         canActivate: [hasRoleGuard],
         data: {roles: ['admin']},
         path: 'admin-products-list',
         title: 'Administración de productos',
         loadComponent: () => import ('@admin/products/products-list/products-list.component'),
     },
     {
         canActivate: [hasRoleGuard],
         data: {roles: ['admin']},
         path: 'admin-user-list',
         title: 'Listado de usuarios',
         loadComponent: () => import ('@admin/users/users-list/users-list.component'),
     },
     {
         canActivate: [hasRoleGuard],
         data: {roles: ['admin']},
         path: 'admin-file-interface',
         title: 'Interface de archivos',
         loadComponent: () => import ('@file-interface/extract-from-json/extract-from-json.component'),
     },
 ] as Routes
