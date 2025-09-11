 import { Component, inject, input } from '@angular/core'
 import { PrimeNgModule } from '@import/primeng'
 import { Product } from '@models/products.model'
 import { CurrencyPipe } from '@angular/common'
 import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog'
  import { MessageService  } from 'primeng/api'
 import { AddToCartComponent } from '@dashboard/add-to-cart/add-to-cart.component'

 @Component({
     selector: 'app-product-details',
     imports: [
         PrimeNgModule,
         CurrencyPipe,
     ],
     providers: [
         DialogService,
         MessageService
     ],
     templateUrl: './product-details.component.html',
     styleUrl: './product-details.component.scss'
 })
 export class ProductDetailsComponent {

     private dialogService = inject(DialogService)
     readonly messageService = inject(MessageService)
     product = input<Product>()
     ref: DynamicDialogRef | undefined
     //--------------------------------------------------------------------------------------------

     ngOnInit() {

     }

     //--------------------------------------------------------------------------------------------

     addToCart() {
         this.ref = this.dialogService.open(AddToCartComponent, {
             header: 'Agregar Producto',
             data: {
                 id: this.product()?.id
             },
             width: '50%',
             height: '80%',
             modal:true,
             closable: true,
             draggable: true,
             contentStyle: {"max-height": "500px", "min-height": "500px", "overflow": "auto"},
             breakpoints: {
                 '960px': '75vw',
                 '640px': '90vw'
             },

         })
        this.ref.onClose.subscribe((product: Product) => {
             if (product) {
                 this.messageService.add({
                     severity: 'success',
                     summary: 'Producto agregado',
                     detail: ''
                 })
             }
        })
     }

    //--------------------------------------------------------------------------------------------

     ngOnDestroy() {

         if (this.ref) {
             this.ref.close()
         }
     }

     //--------------------------------------------------------------------------------------------



 }
