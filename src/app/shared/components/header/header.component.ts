 import { Component, inject, signal} from '@angular/core'
 import { RouterLink } from '@angular/router'
 import { PrimeNgModule } from '@import/primeng'
 import { MenuItem } from 'primeng/api'
 import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog'
 import { LoginComponent } from '@auth/login/login.component';
 import { User } from '@model/users.model'
 import { AuthService } from '@services/auth.service'
 import { LocalStorageService } from '@services/local-storage.service'
 import { Router, RouterModule } from '@angular/router'

 @Component({
     selector: 'app-header',
     imports: [
         PrimeNgModule,
         RouterLink,
         RouterModule
     ],
     providers: [
         DialogService
     ],
     templateUrl: './header.component.html',
     styleUrl: './header.component.scss'
})
export class HeaderComponent {
     private dialogService = inject(DialogService)
     readonly authService = inject(AuthService)
     readonly localStorageService = inject(LocalStorageService)
     readonly router = inject(Router)
     ref: DynamicDialogRef | undefined
     items: MenuItem[] | undefined
     currentUserProfile = signal<User | null>(null)

     ngOnInit() {

         this.getProfile()
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
                         label: 'Actualizar perfil ',
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

         this.ref = this.dialogService.open(LoginComponent, {
             header: 'Iniciar sesión',
             width: '30vw',
             closeOnEscape: false,
             contentStyle: { overflow: 'auto' },
             closable: true,
             draggable: true,
             modal:true,
             breakpoints: {
                 '960px': '75vw',
                 '640px': '90vw'
             },
         })

         this.router.navigate([''])
     }

     //--------------------------------------------------------------------------------------------

     ngOnDestroy() {

         if (this.ref) {
             this.ref.close();
         }

     }

     //--------------------------------------------------------------------------------------------


}
