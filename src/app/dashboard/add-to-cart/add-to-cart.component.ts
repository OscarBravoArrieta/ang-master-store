 import { Component, inject, signal } from '@angular/core'
 import { Validators, FormGroup, FormBuilder, FormsModule, ReactiveFormsModule, FormArray, FormControl, ValidationErrors, AbstractControl} from '@angular/forms'
 import { PrimeNgModule } from '@import/primeng'
 import { ProductsService } from '@services/products.service'
 import { DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog'
 import { Product } from '@models/products.model'
 import { CartService } from '@services/cart.service'
 import { CurrencyPipe } from '@angular/common'

 @Component({
     selector: 'app-add-to-cart',
     imports: [
         PrimeNgModule,
         FormsModule,
         ReactiveFormsModule,
         CurrencyPipe
     ],
     templateUrl: './add-to-cart.component.html',
     styleUrl: './add-to-cart.component.scss'
 })
 export class AddToCartComponent {

     private formBuilder = inject (FormBuilder)
     private productsService = inject(ProductsService)
     private ref = inject (DynamicDialogRef)
     private cartService = inject(CartService)
     private dynamicDialogConfig = inject (DynamicDialogConfig)
     productImages = signal<string[]>([])
     statusForm = signal(false)

     form!: FormGroup
     currentProduct = signal<Product | undefined>(undefined)
     currentId = signal<number>(0)

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

         if (this.dynamicDialogConfig.data) {
             this.currentId.set(this.dynamicDialogConfig.data.id)
             this.getProduct()

         }

     }

     //--------------------------------------------------------------------------------------------

     private buildForm() {

         this.form = this.formBuilder.group ({
             id: [this.currentId()],
             title: ['',[Validators.required]],
             price: ['',[Validators.required]],
             description: ['',[Validators.required]],
             category: ['',[Validators.required]],
             images: ['',[Validators.required]],
             quantity: ['1',Validators.compose([Validators.required, Validators.pattern('[0-9]+'), Validators.min(1)] )]
         })

     }

     //--------------------------------------------------------------------------------------------

     async getProduct(){

         this.productsService.getProduct(this.currentId()).subscribe({
             next: async (currentProduct)=> {
                 this.currentProduct.set(currentProduct)
                 this.productImages.set(await this.getProductImages(Array.from(currentProduct.images)))
                 this.form.patchValue(currentProduct)
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

     addToCartHandler() {

         this.form.value.quantity = Number(this.form.value.quantity)
         this.statusForm.set(this.form.invalid)
         this.cartService.addToCart(this.form.value)
         this.ref.close(this.formBuilder)

     }

     //--------------------------------------------------------------------------------------------

     ngOnDestroy() {

         if (this.ref) {
             this.ref.close()
         }
     }

     //--------------------------------------------------------------------------------------------



 }
