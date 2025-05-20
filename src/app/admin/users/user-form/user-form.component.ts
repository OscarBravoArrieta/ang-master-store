 import { Component, inject, signal } from '@angular/core'
 import { Validators, FormGroup, FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms'
 import { PrimeNgModule } from '@import/primeng'
 import { DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog'
 import { UsersService } from '@services/users.service'
 import { Router, RouterModule } from '@angular/router'
 import { User, UserToUpdate} from '@model/users.model'
 import { CustomValidators } from '@utils/custom-validation'

 @Component({
     selector: 'app-user-form',
     imports: [
         PrimeNgModule,
         FormsModule,
         RouterModule,
         ReactiveFormsModule
     ],
     templateUrl: './user-form.component.html',
     styleUrl: './user-form.component.scss'
 })
 export class UserFormComponent {
     private formBuilder = inject (FormBuilder)
     private ref = inject (DynamicDialogRef)
     private dynamicDialogConfig = inject (DynamicDialogConfig)
     private usersService = inject(UsersService)
     private router = inject(Router)

     form!: FormGroup
     statusForm = signal(false)
     errorFromApi = signal<string>('')
     emailExists = signal<boolean>(false)
     currentUser = signal<User | undefined>(undefined)
     currentId = signal<number>(0)
     isEditable = signal<boolean>(this.dynamicDialogConfig.data.mode == 'view' ?  true: false)
     mode = signal<string>('')

     //--------------------------------------------------------------------------------------------

     constructor() {

         this.buildForm()

     }

     //--------------------------------------------------------------------------------------------

     ngOnInit() {

         if (this.dynamicDialogConfig.data) {

             this.currentId.set(this.dynamicDialogConfig.data.id)
             this.isEditable.set(this.dynamicDialogConfig.data.mode == 'view' ?  true: false)
             this.mode.set(this.dynamicDialogConfig.data.mode)
             this.getUser()

         }

     }

     //--------------------------------------------------------------------------------------------

     private buildForm() {

         this.form = this.formBuilder.group ({
             name: [{value: null, disabled: this.isEditable()},
                     Validators.compose(
                     [
                         Validators.required,
                         Validators.minLength(8)
                     ]
                 )
             ],
             email: [{value: null, disabled: this.isEditable()}, Validators.compose(
                     [
                         Validators.email,
                         Validators.required
                     ]
                 )
             ],
             password: [ {value: null, disabled: this.isEditable()},
                 Validators.compose( [
                         Validators.minLength(8),
                         Validators.required,
                         //Validators.pattern('(?=\\D*\\d)(?=[^a-z]*[a-z])(?=[^A-Z]*[A-Z]).{8,30}'),

                     ]
                 )
             ],
            passwordConfirm: [{value: null, disabled: this.isEditable()}, Validators.compose(
                     [
                         Validators.minLength(8),
                         Validators.required,
                     ]
                 )
             ],
             avatar: [
                {value: null, disabled: this.isEditable()},
                 Validators.compose(
                     [
                         Validators.pattern('(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?')
                     ]
                 )
             ],
         },{
             validators: [ CustomValidators.MatchValidator('password', 'passwordConfirm') ]
         })

     }

     //--------------------------------------------------------------------------------------------

     get emailField() {
         return this.form.get('email')
     }
     get nameField() {
         return this.form.get('name')
     }
     get passwordField() {
         return this.form.get('password')
     }
     get avatarField() {
         return this.form.get('avatar')
     }

     //--------------------------------------------------------------------------------------------

     save() {

         if (this.mode() == 'new') {this.create()}
         if (this.mode() == 'new') {this.update()}
         this.router.navigate(['admin-user-list'])
     }

     //--------------------------------------------------------------------------------------------
     create(){

         this.statusForm.set(this.form.invalid)
         if (this.form.valid) {

            console.log('pasando')

             //this.validateEmail()

             const userToCreate: User = {
                 name: this.form.value.name,
                 email: this.form.value.email,
                 password: this.form.value.password,
                 avatar: this.form.value.avatar
             }

             console.log('User to create->',userToCreate)

             this.usersService.createUser(userToCreate).subscribe({
                 next: (newUser: User) => {

                 }, error: (error: any) => {

                     console.log('error-> ', error.error.message)
                     this.errorFromApi.set(error.statusText)

                 }

             })

         }

     }
     //--------------------------------------------------------------------------------------------
     update(){

         this.statusForm.set(this.form.invalid)
         if (!this.form.valid) { return }

         const userToUpdate: UserToUpdate = {
             email: this.form.value.email,
             name: this.form.value.name,
         }

         this.usersService.updateUser(this.currentId(), userToUpdate).subscribe({
             next: (updatedUser: User) => {
                 console.log('Usuario actualizado')
             }, error: (error: any) => {

                 console.log('error-> ', error.error.message)
                 this.errorFromApi.set(error.statusText)

            }
         })

     }
     //--------------------------------------------------------------------------------------------
     validateEmail() {

         this.usersService.getUsers().subscribe({
             next: (dataSet) => {
                 let data = dataSet
                 let email = data.find( data => data.email === this.form.value.email)
                 this.emailExists.set(email ? true: false)
                 console.log(this.emailExists())
             }, error: (error) => {

                 console.log(error)
             }
         })

     }

     //--------------------------------------------------------------------------------------------
     getUser(){
         this.usersService.getUser(this.currentId()).subscribe({
             next: (currentUser) => {
                 this.currentUser.set(currentUser)
                 this.form.get('passwordConfirm')?.patchValue(currentUser.password)
                 this.form.patchValue(currentUser);

             }
         })
     }

 }
