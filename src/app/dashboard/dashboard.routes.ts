 import { Routes } from '@angular/router';
 import { hasRoleGuard } from 'app/core/guards/has-role.guard';

 export default [
     {
         canActivate: [hasRoleGuard],
         data: {roles: ['customer']},
         path: 'dashboard',
         title: 'Gestionando la tienda',
         loadComponent: () => import ('@dashboard/dashboard/dashboard.component'),
     },
     {
         canActivate: [hasRoleGuard],
         data: {roles: ['customer']},
         path: 'products-in-cart',
         title: 'Productos en el carrito',
         loadComponent: () => import ('@shared/cart/cart.component'),

     }
 ] as Routes
