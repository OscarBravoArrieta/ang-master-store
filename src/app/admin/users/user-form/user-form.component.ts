 import { Component, inject, signal } from '@angular/core'
 import { Validators, FormGroup, FormBuilder, FormsModule, ReactiveFormsModule} from '@angular/forms'
 import { PrimeNgModule } from '@import/primeng'
 import { DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog'
 import { UsersService } from '@services/users.service'
 import { User, UserToUpdate, Role} from '@model/users.model'
 import { Router, RouterModule } from '@angular/router'
 import { CustomValidators } from '@utils/custom-validation'
 import { Select } from 'primeng/select'

 @Component({
     selector: 'app-user-form',
     imports: [
         PrimeNgModule,
         FormsModule,
         RouterModule,
         ReactiveFormsModule,
         Select
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
     roles: Role[] = []
     image: any

     //--------------------------------------------------------------------------------------------

     constructor() {

         this.buildForm()

     }

     //--------------------------------------------------------------------------------------------
     ngOnInit() {
         this.roles = [
             {name: 'Admin', value: 'admin'},
             {name: 'Customer', value: 'customer'}
         ]

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
                     Validators.compose([Validators.required, Validators.minLength(8)])
             ],
             email: [{value: null, disabled: this.isEditable()}, Validators.compose(
                     [Validators.email, Validators.required]
                 )
             ],

             password: [ {value: null, disabled: this.isEditable()},
                 Validators.compose( [Validators.minLength(8), Validators.required,
                         //Validators.pattern('(?=\\D*\\d)(?=[^a-z]*[a-z])(?=[^A-Z]*[A-Z]).{8,30}'),
                     ]
                 )
             ],
            passwordConfirm: [{value: null, disabled: this.isEditable()},
                 Validators.compose([Validators.minLength(8), Validators.required])
             ],
             role: [{value: null, disabled: this.isEditable()},
                 Validators.compose([Validators.required])
             ],
             avatar: [
                {value: null, disabled: this.isEditable()},
                 Validators.compose([Validators.required, Validators.pattern('(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?')])
             ],
         },{
             validators: [ CustomValidators.MatchValidator('password', 'passwordConfirm')]
         })

     }


     //--------------------------------------------------------------------------------------------

     save() {

         if (this.mode() == 'new') {this.create()}
         if (this.mode() == 'edit') {this.update()}
         this.router.navigate(['admin-user-list'])

     }

     //--------------------------------------------------------------------------------------------
     async create(){

         this.statusForm.set(this.form.invalid)
         if (this.form.valid) {

             const res = await this.usersService.uploadAvatar(this.image)
             this.form.value.avatar = res.location
             const userToCreate: User = {
                 name: this.form.value.name,
                 email: this.form.value.email.toLowerCase(),
                 password: this.form.value.password,
                 role: this.form.value.role,
                 avatar: res.location
             }

             this.usersService.createUser(userToCreate).subscribe({
                 next: (newUser: User) => {
                     this.ref.close(this.formBuilder)
                     this.router.navigate(['admin-user-list'])

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
                 this.router.navigate(['admin-user-list'])
                 this.ref.close(this.formBuilder)

             }, error: (error: any) => {

                 console.log('error-> ', error.error.message)
                 this.errorFromApi.set(error.statusText)

            }
         })

     }

     //--------------------------------------------------------------------------------------------
     getUser(){

         if(!this.dynamicDialogConfig.data.id){return}
         this.usersService.getUser(this.currentId()).subscribe({
             next: (currentUser) => {
                 this.currentUser.set(currentUser)
                 this.form.get('passwordConfirm')?.patchValue(currentUser.password)
                 this.form.patchValue(currentUser)
             }
         })
     }

     //--------------------------------------------------------------------------------------------
     onUpload(event:any) {

         this.image = event.files[0]
         this.form.value.avatar = this.image.name
         this.form.get('avatar')?.setValue(`https://api.escuelajs.co/api/v1/files/${this.image.name}`)

     }

     //--------------------------------------------------------------------------------------------

     async uploadImage(file: any) {
         console.log(file)
         const formData = new FormData();
         formData.append("file", file);
         const response = await fetch("https://api.escuelajs.co/api/v1/files/upload", {
             method: "POST",
             body: formData,
         })

         const data = await response.json();
         console.log("Imagen subida:", data);
     }

     //--------------------------------------------------------------------------------------------

     ngOnDestroy() {

        if (this.ref) {
            this.ref.close()
        }
     }

 }
//https://www.crisweb.me/blog/2020-12-24-validaciones-as%C3%ADncronas-customizadas-en-angular/
//https://blog.angular-university.io/angular-custom-validators/
