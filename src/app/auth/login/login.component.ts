 import { Component, inject, signal } from '@angular/core'
 import { Validators, FormGroup, FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms'
 import { PrimeNgModule } from '@import/primeng'
 import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog'
 import { AuthService } from '@services/auth.service'
 import { Router, RouterModule } from '@angular/router'
 import { UserToLog, User  } from '@models/users.model'
 import { UserFormComponent } from '@admin/users/user-form/user-form.component'


 @Component({
     selector: 'app-login',
     imports: [
         PrimeNgModule,
         FormsModule,
         RouterModule,
         ReactiveFormsModule
     ],
     providers: [
         DialogService,
     ],
     templateUrl: './login.component.html',
     styleUrl: './login.component.scss'
 })
 export default class LoginComponent {

     private formBuilder = inject (FormBuilder)
     private authService = inject(AuthService)
     private router = inject(Router)
     private dialogService = inject(DialogService)
     ref!: DynamicDialogRef | undefined

     form!: FormGroup
     statusForm = signal(false)
     errorFromApi = signal<string>('')

     //--------------------------------------------------------------------------------------------

     constructor() {

         this.buildForm()
     }

     //--------------------------------------------------------------------------------------------

     private buildForm() {

         this.form = this.formBuilder.group ({
             email: [null, Validators.compose([Validators.email, Validators.required])],
             password: [null,[Validators.required]],
         })

     }

     //--------------------------------------------------------------------------------------------

     get emailField() {

         return this.form.get('email')

     }

     get passwordField() {

         return this.form.get('password')
     }

     //--------------------------------------------------------------------------------------------

     login() {

         this.statusForm.set(this.form.invalid)

         if (this.form.valid) {
             const user: UserToLog = {
                 email: this.form.value.email,  //'john@mail.com',
                 password: this.form.value.password //'changeme'
             }

             this.authService.logIn(user).subscribe({
                 next: (response: User) => {

                     const currentUserProfile = response

                     if (currentUserProfile.role === 'customer') {

                         this.router.navigate(['dashboard'])

                     } else {

                         this.router.navigate([''])

                     }


                 }, error: (error: any) => {
                     this.errorFromApi.set(error.statusText)
                 }
             })
         }

     }

     // -------------------------------------------------------------------------------------------
     async callCreateUser(id = null, mode: string = 'new'){

         this.ref = this.dialogService.open(UserFormComponent, {
             header: 'Crear usuario',
             data: {
                 id,
                 mode
             },
             width: 'w-30rem',
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
     }

     //--------------------------------------------------------------------------------------------

     ngOnDestroy() {
         if (this.ref) {
             this.ref.close();
         }
     }

     //--------------------------------------------------------------------------------------------

 }
