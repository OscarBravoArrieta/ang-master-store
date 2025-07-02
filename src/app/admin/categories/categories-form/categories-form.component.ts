 import { Component, inject, signal } from '@angular/core'
 import { Validators, FormGroup, FormBuilder, FormsModule, ReactiveFormsModule} from '@angular/forms'
 import { PrimeNgModule } from '@import/primeng'
 import { MessageService  } from 'primeng/api'
 import { DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog'
 import { CategoriesService } from '@services/categories.service'
 import { Category } from '@model/category.model'
 import { Router, RouterModule } from '@angular/router'

 @Component({
     selector: 'app-categories-form',
     imports: [
         PrimeNgModule,
         FormsModule,
         RouterModule,
         ReactiveFormsModule
     ],
     providers: [MessageService],
     templateUrl: './categories-form.component.html',
     styleUrl: './categories-form.component.scss'
 })
 export class CategoriesFormComponent {
     private formBuilder = inject (FormBuilder)
     private ref = inject (DynamicDialogRef)
     private dynamicDialogConfig = inject (DynamicDialogConfig)
     private categoriesService = inject(CategoriesService)
     readonly messageService = inject(MessageService)
     private router = inject(Router)

     form!: FormGroup
     statusForm = signal(false)
     errorFromApi = signal<string>('')
     currentCategory = signal<Category | undefined>(undefined)
     currentId = signal<number>(0)
     isDisabled = signal<boolean>(this.dynamicDialogConfig.data.mode == 'view' ?  true: false)
     mode = signal<string>('')
     image: any

     //--------------------------------------------------------------------------------------------

     constructor() {

         this.buildForm()

     }

     //--------------------------------------------------------------------------------------------

     ngOnInit() {

         if (this.dynamicDialogConfig.data) {

             this.currentId.set(this.dynamicDialogConfig.data.id)
             this.isDisabled.set(this.dynamicDialogConfig.data.mode == 'view' ?  true: false)
             this.mode.set(this.dynamicDialogConfig.data.mode)
             this.getCategory()

         }
     }

     //--------------------------------------------------------------------------------------------

     private buildForm() {

         this.form = this.formBuilder.group ({
             name: [{value: null, disabled: this.isDisabled()},
                 Validators.compose([Validators.required, Validators.minLength(6)])
             ],
             image: [
                 {value: null, disabled: this.isDisabled()},
                 Validators.compose([Validators.required, Validators.pattern('(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?')])
             ],
             slug: [{value: null, disabled: this.isDisabled()},
                 Validators.compose([Validators.required, Validators.minLength(6)])
             ],
         })
     }
     //--------------------------------------------------------------------------------------------

     save() {

         if (this.mode() == 'new') {this.create()}
         if (this.mode() == 'edit') {this.update()}
         this.router.navigate(['admin-categories-list'])

     }

     //--------------------------------------------------------------------------------------------

     async create(){

         this.statusForm.set(this.form.invalid)
         if (this.form.valid) {
             const res = await this.categoriesService.uploadAvatar(this.image)
             this.form.value.avatar = res.location
             const categoryToCreate: Category = {
                 name: this.form.value.name,
                 slug: this.form.value.slug,
                 image: res.location
             }

             this.categoriesService.createCategory(categoryToCreate).subscribe({
                 next: (newCategory: Category) => {
                     this.messageService.add({
                         severity: 'info',
                         summary: 'Confirmed',
                         detail: 'Registro guardado'
                     })
                     this.ref.close(this.formBuilder)
                 }, error: (error: any) => {
                     console.log('error-> ', error.error.message)
                     this.errorFromApi.set(error.statusText)
                 }
             })
         }

     }

     //--------------------------------------------------------------------------------------------
     async update(){

         this.statusForm.set(this.form.invalid)
         if (!this.form.valid) { return }
         const res = await this.categoriesService.uploadAvatar(this.image)
         console.log('Res.location...',res.location)
         this.form.value.image = res.location
         const categoryToUpdate: Category = {
             name: this.form.value.name,
             slug: this.form.value.email,
             image: this.form.value.image
         }

         this.categoriesService.updateCategory(this.currentId(), categoryToUpdate).subscribe({
              next: (updatedCategory: Category) => {

                 this.messageService.add({
                     severity: 'info',
                     summary: 'Confirmed',
                     detail: 'Registro guardado'
                 })

                 this.ref.close(this.formBuilder)

              }, error: (error: any) => {

                 console.log('error-> ', error.error.message)
                 this.errorFromApi.set(error.statusText)

            }
         })

     }

     //--------------------------------------------------------------------------------------------

     getCategory() {
         if(!this.dynamicDialogConfig.data.id){return}
         this.categoriesService.getCategorie(this.currentId()).subscribe({
             next: (currentCategory) => {
                 this.currentCategory.set(currentCategory)
                 this.form.patchValue(currentCategory)
             }
         })
     }

     //--------------------------------------------------------------------------------------------
     onUpload(event: any) {

         this.image = event.files[0]
         this.form.value.image = this.image.name
         this.form.get('image')?.setValue(`https://api.escuelajs.co/api/v1/files/${this.image.name}`)
         if (this.image) {
             const reader = new FileReader()
             reader.onload = (e: any) => {
                 this.form.value.image = e.target.result
             }
             reader.readAsDataURL(this.image);
         }
     }

     //--------------------------------------------------------------------------------------------

     fileRemoved(event: any) {

         if(!event.files){

             const image = ''
             this.form.patchValue({image})

         }

     }

     //--------------------------------------------------------------------------------------------

     ngOnDestroy() {

         if (this.ref) {
             this.ref.close()
         }
     }

     //--------------------------------------------------------------------------------------------



 }
