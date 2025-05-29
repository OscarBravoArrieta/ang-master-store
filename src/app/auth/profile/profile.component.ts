 import { Component, inject, signal } from '@angular/core'
 import { Validators, FormGroup, FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms'
 import { Router, RouterModule } from '@angular/router'
 import { PrimeNgModule } from '@import/primeng'
 import { ConfirmationService, MessageService  } from 'primeng/api'
 import { FieldsetModule } from 'primeng/fieldset'
 import { PrimeNG } from 'primeng/config'
 import { User, UserToUpdate } from '@model/users.model'
 import { AuthService } from '@services/auth.service'
 import { UsersService } from '@services/users.service'


 @Component({
     selector: 'app-profile',
     imports: [
         PrimeNgModule,
         FormsModule,
         RouterModule,
         ReactiveFormsModule,
         //ConfirmDialog
     ],
     providers: [ConfirmationService, MessageService, FieldsetModule],
     templateUrl: './profile.component.html',
     styleUrl: './profile.component.scss'
 })
 export default class ProfileComponent {
     private formBuilder = inject (FormBuilder)
     readonly authService = inject(AuthService)
     readonly usersService = inject(UsersService)
     readonly confirmationService = inject(ConfirmationService)
     readonly messageService = inject(MessageService)
     readonly primeNG = inject(PrimeNG)
     private router = inject(Router)
     currentUserProfile = signal<User | null>(null)
     form!: FormGroup
     statusForm = signal(false)
     errorFromApi = signal<string>('')
     constructor() {

         this.buildForm()

     }

     //--------------------------------------------------------------------------------------------

     ngOnInit() {

         this.primeNG.ripple.set(true)

         this.getProfile()

     }

     //--------------------------------------------------------------------------------------------

     private buildForm() {

         this.form = this.formBuilder.group ({
             email: [this.currentUserProfile()?.email, Validators.compose([Validators.email, Validators.required])],
             name: [this.currentUserProfile()?.name,[Validators.required]],
             role: [this.currentUserProfile()?.role,[Validators.required]]
         })

     }

     //--------------------------------------------------------------------------------------------

     get emailField() {

         return this.form.get('email')

     }

     get nameField() {

         return this.form.get('name')

     }

     //--------------------------------------------------------------------------------------------

     getProfile() {

         if(this.authService.isLogged()) {
             this.authService.getProfile().subscribe({
                 next:(response: User)=> {

                     this.currentUserProfile.set(response)
                     this.form.controls['email'].setValue(this.currentUserProfile()?.email)
                     this.form.controls['name'].setValue(this.currentUserProfile()?.name)
                     this.form.controls['role'].setValue(this.currentUserProfile()?.role)

                 }
             })
         }

     }

     //--------------------------------------------------------------------------------------------

     updateUser(){

         this.statusForm.set(this.form.invalid)

         if (this.form.valid) {
             const userToUpdate: UserToUpdate = {
                 email: this.form.value.email,
                 name: this.form.value.name
             }

             this.usersService.updateUser(this.currentUserProfile()?.id, userToUpdate).subscribe({
                 next: (response: User) => {
                     this.messageService.add({
                         severity: 'info',
                         summary: 'Confirmed',
                         detail: 'Se actualizó el perfil'
                     });
                     this.currentUserProfile.set(response)
                     this.goHome()
                     this.authService.logOut()
                 }, error: (error: any) => {
                     this.errorFromApi.set(error.error.message)
                     this.messageService.add({
                         severity: 'error',
                         summary: 'Rechazada',
                         detail: 'Actualización rechazada',
                         life: 3000,
                     });

                 }
             })
         }
     }

     //--------------------------------------------------------------------------------------------
     confirm() {

         this.confirmationService.confirm({
             message: "Se actualizará el perfil y deberá iniciar sesión nuevamente." + "\n¿Desea continuar?" ,
             header: 'Información',
             closable: true,
             closeOnEscape: false,
             icon: 'pi pi-question-circle',
             rejectButtonProps: {
                 label: 'No. Déjalo como está',
                 severity: 'secondary',
                 outlined: true,
             },
             acceptButtonProps: {
                 label: 'Si. Actualiza el perfil',
             },
             accept: () => {
                 setTimeout(function(){
                     console.log("Se actualizó el perfil");
                 }, 3000)
                 this.updateUser()
             },
             reject: () => {
                 this.messageService.add({
                     severity: 'error',
                     summary: 'Cancelado',
                     detail: 'Actualización cancelada',
                     life: 3000,
                 })
             },
         })
     }

     //-------------------------------------------------------------------------------------------

     goHome(){

         this.router.navigate([''])

     }

     //--------------------------------------------------------------------------------------------

     changeDetenction() {

         if((this.emailField?.value === this.currentUserProfile()?.email) && (this.nameField?.value === this.currentUserProfile()?.name) ){

             return true

         } else {

             return false
         }

     }

 }
