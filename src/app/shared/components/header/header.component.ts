 import { Component, inject, signal, SimpleChanges} from '@angular/core'
 import { RouterLink } from '@angular/router'
 import { PrimeNgModule } from '@import/primeng'
 import { MenuItem } from 'primeng/api'
 import { User } from 'app/core/models/users.model'
 import { AuthService } from 'app/core/services/auth.service'
 import { CartService } from 'app/core/services/cart.service'
 import { LocalStorageService } from 'app/core/services/local-storage.service'
 import { Router, RouterModule } from '@angular/router'

 @Component({
     selector: 'app-header',
     imports: [
         PrimeNgModule,
         RouterLink,
         RouterModule
     ],
     templateUrl: './header.component.html',
     styleUrl: './header.component.scss'
})
export class HeaderComponent {
     readonly authService = inject(AuthService)
     readonly cartService = inject(CartService)
     readonly localStorageService = inject(LocalStorageService)
     readonly router = inject(Router)
     cart = this.cartService.cart
     items: MenuItem[] | undefined
     currentUserProfile = this.authService.currentUserProfile

     ngOnInit() {

         this.getProfile()
         this.currentUserProfile = this.authService.currentUserProfile
         this.defineMenu()

     }

     //--------------------------------------------------------------------------------------------

     getProfile() {

         this.authService.getProfile().subscribe({
             next: (response: User)=> {
                 this.currentUserProfile.set(response)
             }, error: ((error: any) =>{
                 console.log('No se pudo obtener el perfil del usuario...')
             })
         })
     }

     //--------------------------------------------------------------------------------------------

     defineMenu() {

         this.items = [
             {
                 label: 'Users options',
                 items: [
                     {
                         label: "Actualizar perfil",
                         icon: 'pi pi-user-edit',
                         command: (event) => {

                             this.router.navigate(['auth-profile'])
                         }
                     },
                     {
                         label: 'Cerrar sesión',
                         icon: 'pi pi-sign-out',
                         command: (event) => {
                             this.authService.logOut()

                         }
                     }
                 ]
             }
         ]
     }

     //---------------------------------------------------------------------------------------------

     callLogin() {

          this.router.navigate(['auth-login'])

     }

     //--------------------------------------------------------------------------------------------
     goToCart(){

         this.router.navigate(['products-in-cart'])

     }

 }
