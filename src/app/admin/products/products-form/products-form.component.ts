 import { Component, inject, signal } from '@angular/core'
 import { Validators, FormGroup, FormBuilder, FormsModule, ReactiveFormsModule, FormArray, FormControl, ValidationErrors, AbstractControl} from '@angular/forms'
 import { PrimeNgModule } from '@import/primeng'
 import { DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog'
 import { ProductsService } from '@services/products.service'
 import { CategoriesService } from '@services/categories.service'
 import { Product, ProductToUpdate } from '@model/products.model'
 import { Router, RouterModule } from '@angular/router'
 import { SelectNumberInterface } from '@model/common-models'

 @Component({
     selector: 'app-products-form',
     imports: [
         PrimeNgModule,
         FormsModule,
         RouterModule,
         ReactiveFormsModule,

     ],
     templateUrl: './products-form.component.html',
     styleUrl: './products-form.component.scss'
 })
 export class ProductsFormComponent {
     private formBuilder = inject (FormBuilder)
     private ref = inject (DynamicDialogRef)
     private dynamicDialogConfig = inject (DynamicDialogConfig)
     private productsService = inject(ProductsService)
     private categoriesService = inject(CategoriesService)
     private router = inject(Router)

     form!: FormGroup
     statusForm = signal(false)
     errorFromApi = signal<string>('')
     currentProduct = signal<Product | undefined>(undefined)
     categories = signal<SelectNumberInterface[]>([])
     currentId = signal<number>(0)
     isDisabled = signal<boolean>(this.dynamicDialogConfig.data.mode == 'view' ?  true: false)
     mode = signal<string>('')
     productImages = signal<string[]>([])
     image: any

     responsiveOptions: any[] = [
         {
             breakpoint: '1300px',
             numVisible: 4,
         },
         {
             breakpoint: '575px',
             numVisible: 1,
         },

     ]

     //--------------------------------------------------------------------------------------------

     constructor() {

         this.buildForm()

     }

     //--------------------------------------------------------------------------------------------

     ngOnInit() {

         this.getCategories()

         if (this.dynamicDialogConfig.data) {

             this.currentId.set(this.dynamicDialogConfig.data.id)
             this.isDisabled.set(this.dynamicDialogConfig.data.mode == 'view' ?  true: false)
             this.mode.set(this.dynamicDialogConfig.data.mode)
             this.getProduct()

         }

     }

     //--------------------------------------------------------------------------------------------

     private buildForm() {

         this.form = this.formBuilder.group ({
             title: [{value: null, disabled: this.isDisabled()},
                 Validators.compose([Validators.required, Validators.minLength(6)])
             ],
             price: [{value: null, disabled: this.isDisabled()},
                 Validators.compose([Validators.required, Validators.pattern('[0-9]+'), Validators.min(1)] )
             ],
             description: [{value: null, disabled: this.isDisabled()},
                 Validators.compose([Validators.required, Validators.minLength(6)])
             ],
             categoryId: [{value: null, disabled: this.isDisabled()},
                 Validators.compose([Validators.required])
             ],
             images: [[], this.imagesRequiredValidator]

         })
     }

     //--------------------------------------------------------------------------------------------
     imagesRequiredValidator(control: AbstractControl): ValidationErrors | null {

         return control.value && control.value.length > 0 ? null : { required: true }

     }

     //--------------------------------------------------------------------------------------------

     getCategories() {

         this.categoriesService.getCategories().subscribe( {
             next: (categories) => {
                 this.categories.set(categories
                     .map(category => ({
                         name: category.name,
                         value: Number(category.id)
                     })
                 ))
             }
         })
     }

     //--------------------------------------------------------------------------------------------

     save() {

         if (this.mode() == 'new') {this.create()}
         if (this.mode() == 'edit') {this.update()}
         this.router.navigate(['admin-products-list'])

     }

     //--------------------------------------------------------------------------------------------

     async create(){

        this.statusForm.set(this.form.invalid)

         if (this.form.valid) {

             const img: string[] = await this.saveImages()

             this.productsService.createProduct(this.form.value).subscribe({
                 next: (newProduct: Product) => {
                     this.ref.close(this.formBuilder)

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
         const productToUpdate: ProductToUpdate = {
             title: this.form.value.title,
             price: Number(this.form.value.price)
         }

          console.log(this.currentId(), productToUpdate)

         this.productsService.updateProduct(this.currentId(),productToUpdate).subscribe({
             next: (updatedProduct: Product) => {
                 this.ref.close(this.formBuilder)
             }, error: (error: any) => {

                 console.log('error-> ', error)
                 this.errorFromApi.set(error.statusText)

            }
         })


     }

     //---------------------------------------------------------------------------------------------

     async getProduct(){

         if(!this.dynamicDialogConfig.data.id){return}
         this.productsService.getProduct(this.currentId()).subscribe({
             next: async (currentProduct)=> {
                 this.currentProduct.set(currentProduct)
                 this.productImages.set(await this.getProductImages(Array.from(currentProduct.images)))
                 this.form.patchValue(currentProduct)
                 this.form.get('categoryId')?.setValue(currentProduct.category?.id)
             }
         })
     }

     //--------------------------------------------------------------------------------------------
     getProductImages(curentProductsImages: string[]){

         let imgs: any = []

         curentProductsImages.forEach( async (url: string) => {
             imgs.push(
                 {
                     itemImageSrc: url,
                     thumbnailImageSrc: url
                 }
             )
         })
         return imgs

     }

     //--------------------------------------------------------------------------------------------

     onUpload(event: any) {

         const images = this.form.value.images
         for (let file of event.files) {
             this.productImages.update(data => [...data, file])
             images.push(event.files[0].name)
             this.form.patchValue({ images })
         }
     }

     //--------------------------------------------------------------------------------------------

     fileRemoved(event: any) {

         const index = this.productImages().findIndex((obj:any) => obj.name === event.file.name)

         if (index !== -1) {

             this.productImages().splice(index, 1)

         }

         if(this.productImages().length === 0) {

             const images: any = []
             this.form.patchValue({ images })
         }

     }


     //--------------------------------------------------------------------------------------------
     saveImages(){ //To save every imgage, using the end point api

         let imgs: any = []

         this.productImages().forEach(async (element: any, index) => {

              if (element) {
                 const reader = new FileReader()
                 reader.onload = (e: any) => {
                     //console.log(e.target.result)
                 }
                 reader.readAsDataURL(element)
                 const res = await this.productsService.uploadAvatar(element)
                 this.form.value.images.push(res.location)
                 this.form.get(`images[${index}]`)?.setValue(res)
                 imgs.push(res.location)

              }
         })


         return imgs
     }


     //--------------------------------------------------------------------------------------------

     ngOnDestroy() {

         if (this.ref) {
             this.ref.close()
         }
     }

     //--------------------------------------------------------------------------------------------

 }
