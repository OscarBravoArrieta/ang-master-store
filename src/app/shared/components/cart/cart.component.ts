 import { Component, inject, signal } from '@angular/core'
 import { CartService } from 'app/core/services/cart.service'
 import { PrimeNgModule } from '@import/primeng'
 import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog'
 import { ConfirmationService, MessageService } from 'primeng/api'
 import { Product } from 'app/core/models/products.model'
 import { DataSchema } from 'app/core/models/data-schema.model'
 import { CurrencyPipe } from '@angular/common'
 import { NgxPayPalModule } from 'ngx-paypal'
 import { ICreateOrderRequest, IPayPalConfig } from 'ngx-paypal'
 import { environment } from '@environments/environment.development'

 @Component({
     selector: 'app-cart',
     imports: [
         PrimeNgModule,
         CurrencyPipe,
         NgxPayPalModule
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
     showSuccess: boolean = false
     showSpinner: boolean = false

     public payPalConfig ? : IPayPalConfig

     //--------------------------------------------------------------------------------------------

     ngOnInit(){

         this.getProducts()
         this.getCols()
         this.initConfig()

     }

     //--------------------------------------------------------------------------------------------

     private initConfig(): void {

         this.payPalConfig = {
             currency: 'EUR',
             clientId: environment.clienId,
             createOrderOnClient: (data) => <ICreateOrderRequest> {
                 intent: 'CAPTURE',
                 purchase_units: [{
                     amount: {
                         currency_code: 'EUR',
                         value: this.cartService.total().toFixed(2),
                         breakdown: {
                             item_total: {
                                  currency_code: 'EUR',
                                  value: this.cartService.total().toFixed(2),
                             }
                         }
                     },
                     items: this.getItems()
                 }]
             },
             advanced: {
                 commit: 'true'
             },
             style: {
                 label: 'paypal',
                 layout: 'vertical'
             },
             onApprove: (data, actions) => {
                 console.log('onApprove - transaction was approved, but not authorized', data, actions)
                 this.showSpinner = true
                //  actions.order.get().then((details: any) => {
                //      console.log('onApprove - you can get full order details inside onApprove: ', details);

                //  })
                 return actions.order.capture().then((details: any) => {
                     this.showSuccess = true
                     this.showSpinner = false
                 })

             },
             onClientAuthorization: async (data) => {
                 console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data)
                 //this.showSuccess = true
             },
             onCancel: (data, actions) => {
                 console.log('OnCancel', data, actions)
                 //this.showCancel = true;

             },
             onError: err => {
                 console.log('OnError', err)
                 //his.showError = true;
             },
             onClick: (data, actions) => {
                 console.log('onClick', data, actions)
                 //this.resetStatus();
             }
         }
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
             {field: 'price', header: 'Price', sortableColumnDisabled: false, contentType: 'currency' },
             {field: 'quantity', header: 'Quantity', sortableColumnDisabled: false, contentType: 'number' },
             {field: 'category', header: 'Category', sortableColumnDisabled: true, contentType: 'object' },
             {field: 'images', header: 'Image', sortableColumnDisabled: true, contentType: 'image-array' }

         ])
     }

     //--------------------------------------------------------------------------------------------

     getItems(){

         const items: any[] = []
         let item = {}
         this.cart().forEach((index: any) => {

             item = {
                 name: index.title,
                 quantity: index.quantity.toString(),
                 category: 'DIGITAL_GOODS',//index.category?.name,
                 unit_amount: {
                     currency_code: 'EUR',
                     value: index.price.toFixed(2)
                 }

             }
             items.push(item)
         })
         return items
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
         this.messageService.add({
             severity: 'success',
             summary: 'Producto eliminado',
             detail: '',
             life: 3000,
         })
         this.getProducts()

     }

     //--------------------------------------------------------------------------------------------

     closeDialog() {

         this.showSuccess = false
         this.delete(undefined)

     }

     //--------------------------------------------------------------------------------------------
 }
