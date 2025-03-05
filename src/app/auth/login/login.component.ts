 import { Component, inject, signal, } from '@angular/core'
 import { Validators, FormGroup, FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms'
 import { PrimeNgModule } from '@import/primeng'
 import { AuthService } from '@services/auth.service'

 import { DynamicDialogRef } from 'primeng/dynamicdialog'

 import { Router, RouterModule } from '@angular/router'
 import { UserToLog, Token, User  } from '@model/users.model'


 @Component({
     selector: 'app-login',
     imports: [
         PrimeNgModule,
         FormsModule,
         RouterModule,
         ReactiveFormsModule,

     ],
     templateUrl: './login.component.html',
     styleUrl: './login.component.scss'
 })
 export class LoginComponent {

     private formBuilder = inject (FormBuilder)
     private authService = inject(AuthService)
     private router = inject(Router)

     form!: FormGroup
     statusForm = signal(false)
     private ref = inject (DynamicDialogRef)
     errorFromApi = signal<string>('')


     //--------------------------------------------------------------------------------------------

     constructor() {

         this.buildForm()
     }

     //--------------------------------------------------------------------------------------------

     private buildForm() {

         this.form = this.formBuilder.group ({
             email: ['', Validators.compose([Validators.email, Validators.required])],
             password: ['',[Validators.required]],
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
                     console.log('currentUserProfile desde login...',currentUserProfile )
                     //this.router.navigate([''])


                     if (currentUserProfile.role === 'customer') {

                         this.router.navigate(['dashboard'])

                     } else {

                         this.router.navigate([''])

                     }

                     this.ref.close(this.formBuilder)

                 }, error: (error: any) => {
                     this.errorFromApi.set(error.statusText)
                 }
             })
         }

     }

     // -------------------------------------------------------------------------------------------

    ngOnDestroy() {

        if (this.ref) {
            this.ref.close()
        }
    }



 }
