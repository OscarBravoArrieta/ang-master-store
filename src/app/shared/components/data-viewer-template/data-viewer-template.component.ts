
 import { Component, inject, input, signal, effect } from '@angular/core'
 import { CommonModule } from '@angular/common'
 import { PrimeNgModule } from '@import/primeng'
 import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog'
 import { UserFormComponent } from '@admin/users/user-form/user-form.component'
 import { ProductsFormComponent } from '@admin/products/products-form/products-form.component'
 import { CategoriesFormComponent } from '@admin/categories/categories-form/categories-form.component'
 import { ConfirmationService, MessageService  } from 'primeng/api'
 import { UsersService } from '@services/users.service'
 import { CategoriesService } from '@services/categories.service'
 import { ProductsService } from '@services/products.service'
 import { ExportService } from '@services/export.service'
 import { Category } from '@models/category.model'
 import { User } from '@models/users.model'
 import { Product } from '@models/products.model'

 @Component({
     selector: 'app-data-viewer-template',
     imports: [
         CommonModule,
         PrimeNgModule,
     ],
     providers: [
         DialogService,
         ConfirmationService,
         MessageService
     ],
     templateUrl: './data-viewer-template.component.html',
     styleUrl: './data-viewer-template.component.scss'
 })
 export class DataViewerTemplateComponent {

     private dialogService = inject(DialogService)
     readonly confirmationService = inject(ConfirmationService)
     readonly messageService = inject(MessageService)
     private categoriesService = inject(CategoriesService)
     private productsService = inject(ProductsService)
     private usersService = inject(UsersService)
     private exportService = inject(ExportService)
     dataSet = input<any[]>([])
     dataSource = input<string>('')
     data = signal<any[]>([])

     isDisabled = signal<boolean>(this.dataSet().length === 0 ?  true: false)
     cols = input<any[]>([])
     ref: DynamicDialogRef | undefined

     constructor() {

         effect(() => {
             this.data.set([...this.dataSet()]) //synchronize the internal signal with the input
         })
     }

     //--------------------------------------------------------------------------------------------

     ngOnChanges(){

         this.isDisabled.set(this.dataSet().length === 0 ?  true: false)

     }

     //--------------------------------------------------------------------------------------------

     callDialog(id = null, mode: string) {

         switch(this.dataSource()) {
             case "users": {
                 this.ref = this.dialogService.open(UserFormComponent, {
                     header: 'Gestionando ' + this.dataSource(),
                     data: {
                         id,
                         mode
                     },
                     width: 'w-30rem',
                     closeOnEscape: false,
                     contentStyle: { overflow: 'auto' },
                     closable: true,
                     draggable: true,
                     modal:true,
                     breakpoints: {
                         '960px': '75vw',
                         '640px': '90vw'
                     },
                 })
                 this.ref.onClose.subscribe((user: User) => {

                     if (user) {
                         this.usersService.getUsers().subscribe({
                             next: (newData) => {
                                 this.data.set(newData)
                                 this.messageService.add({
                                     severity: 'success',
                                     summary: 'Usuario guardado',
                                     detail: ''
                                 })
                             }
                         })
                     }
                 })
                 break

             }
             case "products": {
                 this.ref = this.dialogService.open(ProductsFormComponent, {
                     header: 'Gestionando ' + this.dataSource(),
                     data: {
                         id: id,
                         mode
                     },
                     width: '40vw',
                     height: '100vw',
                     closeOnEscape: false,
                     contentStyle: { overflow: 'auto' },
                     closable: true,
                     draggable: true,
                     modal:true,
                     breakpoints: {
                         '960px': '50vw',
                         '640px': '90vw'
                     },
                 })
                 this.ref.onClose.subscribe((product: Product) => {

                     if (product) {
                         this.productsService.getProducts().subscribe({
                             next: (newData) => {
                                 this.data.set(newData)
                                 this.messageService.add({
                                     severity: 'success',
                                     summary: 'Producto guardado',
                                     detail: ''
                                 })
                             }
                         })
                     }
                 })
                 break
             }
             case "categories": {
                 this.ref = this.dialogService.open(CategoriesFormComponent, {
                     header: 'Gestionando ' + this.dataSource(),
                     data: {
                         id: id,
                         mode
                     },
                     width: '30vw',
                     closeOnEscape: false,
                     contentStyle: { overflow: 'auto' },
                     closable: true,
                     draggable: true,
                     modal:true,
                     breakpoints: {
                         '960px': '75vw',
                         '640px': '90vw'
                     },
                 })

                 this.ref.onClose.subscribe((category: Category) => {
                     if (category) {
                         this.categoriesService.getCategories().subscribe({
                             next: (newData) => {
                                 this.data.set(newData)
                                 this.messageService.add({
                                     severity: 'success',
                                     summary: 'Categoría guardada',
                                     detail: ''
                                 })
                             }
                         })
                     }
                 })
                 break
             }
         }
     }

     //--------------------------------------------------------------------------------------------
     confirm(dataSource: string, rowData: any){

         const item: string = dataSource  == 'products' ? ` el producto: ${rowData.title}`: ` la categoría: ${rowData.name}`

         this.confirmationService.confirm({
             message: `Se eliminará ${item}. ¿Desea continuar?` ,
             header: 'Confirmación',
             closable: true,
             closeOnEscape: false,
             icon: 'pi pi-question-circle',
             rejectButtonProps: {
                 label: 'No, no lo elimines',
                 severity: 'secondary',
                 outlined: true,
             },
             acceptButtonProps: {
                 label: 'Si, continua por favor',
             },
             accept: () => {
                 setTimeout(function(){
                     console.log("Intentando eliminar el registro");
                 }, 3000)
                 this.deleteRecord(dataSource, rowData)

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

     confirmPopUp(event: Event){
       this.confirmationService.confirm({
            target: event.target as EventTarget,
            message: 'Are you sure you want to proceed?',
            icon: 'pi pi-exclamation-triangle',
            rejectButtonProps: {
                label: 'Cancel',
                severity: 'secondary',
                outlined: true
            },
            acceptButtonProps: {
                label: 'Save'
            },
            accept: () => {
                this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'You have accepted', life: 3000 });
            },
            reject: () => {
                this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
            }
        })

     }
     //--------------------------------------------------------------------------------------------
     deleteRecord(dataSource: string, rowData: any){

         if(dataSource == 'categories'){

             this.categoriesService.deleteCategory(rowData.id).subscribe({
                 next:(response: boolean) => {

                     if (response){
                         this.messageService.add({
                             severity: 'info',
                             summary: 'Confirmado',
                             detail: 'Se eliminó el registro'
                         })
                     }

                     console.log('Estado de la eliminación: ', response)

                 }, error: (error: any) => {
                     console.log(error.statusText)
                     this.messageService.add({
                         severity: 'error',
                         summary: 'Error',
                         detail: 'Error: ' + error.statusText,
                         life: 3000,
                     })
                 }
              })

         }
         if(dataSource == 'products'){
             this.productsService.deleteProduct(rowData.id).subscribe({
                 next:(response: boolean) => {

                     if (response){
                         this.messageService.add({ severity: 'info', summary: 'Confirmado', detail: 'Se eliminó el registro' });
                     }

                     console.log('Estado de la eliminación: ', response)

                 }, error: (error: any) => {
                     this.messageService.add({
                         severity: 'error',
                         summary: 'Error',
                         detail: 'Error' + error,
                         life: 3000,
                     })
                 }
             })
         }

     }

     //--------------------------------------------------------------------------------------------

     export(){

         let fileDate = new Date().toISOString()
         this.exportService.exportJsonToExcel(this.dataSet(), this.dataSource() + '-' + fileDate)

     }

     //--------------------------------------------------------------------------------------------

     ngOnDestroy() {

         if (this.ref) {
             this.ref.close()
         }

     }

     //--------------------------------------------------------------------------------------------

 }
