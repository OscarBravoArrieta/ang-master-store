 import { Component, inject, signal } from '@angular/core'
 import { Validators, FormGroup, FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms'
 import { PrimeNgModule } from '@import/primeng'
 import { AuthService } from '@services/auth.service'
 import { Router, RouterModule } from '@angular/router'
 import { UserToLog, User  } from '@model/users.model'


 @Component({
     selector: 'app-login',
     imports: [
         PrimeNgModule,
         FormsModule,
         RouterModule,
         ReactiveFormsModule
     ],
     templateUrl: './login.component.html',
     styleUrl: './login.component.scss'
 })
 export default class LoginComponent {

     private formBuilder = inject (FormBuilder)
     private authService = inject(AuthService)
     private router = inject(Router)

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
                             .then(() => {
                             window.location.reload()
                         })

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

 }
