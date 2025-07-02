 import { Component, inject, input, signal } from '@angular/core'
 import { PrimeNgModule } from '@import/primeng'
 import { Product } from '@model/products.model'
 import { CurrencyPipe } from '@angular/common'
 import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog'
 import { AddToCartComponent } from '@dashboard/add-to-cart/add-to-cart.component'

 @Component({
     selector: 'app-product-details',
     imports: [
         PrimeNgModule,
         CurrencyPipe,
     ],
     providers: [
         DialogService
     ],
     templateUrl: './product-details.component.html',
     styleUrl: './product-details.component.scss'
 })
 export class ProductDetailsComponent {

     private dialogService = inject(DialogService)
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
     }

    //--------------------------------------------------------------------------------------------

     ngOnDestroy() {

         if (this.ref) {
             this.ref.close()
         }
     }

     //--------------------------------------------------------------------------------------------



 }
