 import { Component, inject, signal } from '@angular/core'
 import { CartService } from '@services/cart.service'
 import { PrimeNgModule } from '@import/primeng'
 import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog'
 import { ConfirmationService, MessageService } from 'primeng/api'
 import { Product } from '@model/products.model'
 import { DataSchema } from '@model/data-schema.model'
 import { CurrencyPipe } from '@angular/common'

 @Component({
     selector: 'app-cart',
     imports: [
         PrimeNgModule,
         CurrencyPipe
     ],
     providers: [
         DialogService,
         ConfirmationService,
         MessageService

     ],
     templateUrl: './cart.component.html',
     styleUrl: './cart.component.scss'

 })
 export default class CartComponent {

     readonly confirmationService = inject(ConfirmationService)
     readonly cartService = inject(CartService)
     readonly messageService = inject(MessageService)

     cart = this.cartService.cart
     cols = signal<DataSchema[]>([])
     isDisabled = signal<boolean>(this.cart().length === 0 ?  true: false)

     //--------------------------------------------------------------------------------------------

     ngOnInit(){

         this.getProducts()
         this.getCols()

     }

     //--------------------------------------------------------------------------------------------


     getProducts(){

         this.cart = this.cartService.cart
         this.isDisabled.set(this.cart().length === 0 ?  true: false)

     }

     //--------------------------------------------------------------------------------------------

     getCols(){

         this.cols.set([

             {field: 'title', header: 'Name', sortableColumnDisabled: false, contentType: 'string' },
             {field: 'price', header: 'Price', sortableColumnDisabled: false, contentType: 'number' },
             {field: 'quantity', header: 'Quantity', sortableColumnDisabled: false, contentType: 'number' },
             {field: 'category', header: 'Category', sortableColumnDisabled: true, contentType: 'object' },
             {field: 'images', header: 'Image', sortableColumnDisabled: true, contentType: 'image-array' }

         ])
     }

     //--------------------------------------------------------------------------------------------
     confirm(rowData: Product | null){

         this.confirmationService.confirm({
             message: rowData ? `¿Elimina ${rowData.title}?`: 'Se eliminarán todos los registros. ¿Desea continuar?',
             header: 'Confirmación',
             closable: true,
             closeOnEscape: false,
             icon: 'pi pi-question-circle',
             rejectButtonProps: {
                 label: 'No, deja todo como está',
                 severity: 'secondary',
                 outlined: true,
             },
             acceptButtonProps: {
                 label: 'Si, continua por favor',
             },
              accept: () => {
                 this.delete(rowData?.id)
             },
             reject: () => {
                 this.messageService.add({
                     severity: 'error',
                     summary: 'Cancelado',
                     detail: 'Eliminación declinada',
                     life: 3000,
                 })
             },
         })
     }

     //--------------------------------------------------------------------------------------------

     delete(id: number | undefined) {

         this.cartService.delete(id)
         this.getProducts()


     }

     //--------------------------------------------------------------------------------------------
 }
