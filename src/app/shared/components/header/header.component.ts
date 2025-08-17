 import { Component, inject, signal, SimpleChanges} from '@angular/core'
 import { RouterLink } from '@angular/router'
 import { PrimeNgModule } from '@import/primeng'
 import { MenuItem } from 'primeng/api'
 import { User } from '@model/users.model'
 import { AuthService } from '@services/auth.service'
 import { CartService } from '@services/cart.service'
 import { LocalStorageService } from '@services/local-storage.service'
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

         if(this.authService.isLogged()) {
             this.authService.getProfile().subscribe({
                 next:(response: User)=> {

                     this.currentUserProfile.set(response)

                 }
             })
         }

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
