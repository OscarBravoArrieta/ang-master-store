 import { Component, inject, input } from '@angular/core'
 import { CommonModule } from '@angular/common'
 import { PrimeNgModule } from '@import/primeng'
 import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog'
 import { UserFormComponent } from '@admin/users/user-form/user-form.component'
 import { ProductsFormComponent } from '@admin/products/products-form/products-form.component'
 import { CategoriesFormComponent } from '@admin/categories/categories-form/categories-form.component'
 import { ConfirmationService, MessageService  } from 'primeng/api'
 import { CategoriesService } from '@services/categories.service'
 import { ProductsService } from '@services/products.service'

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
     dataSet = input<any[]>([])
     dataSource = input<string>('')
     cols = input<any[]>([])
     ref: DynamicDialogRef | undefined

     //--------------------------------------------------------------------------------------------

     callDialog(id = null, mode: string) {

         switch(this.dataSource()) {
             case "users": {
                 this.ref = this.dialogService.open(UserFormComponent, {
                     header: 'Manage record ' + this.dataSource(),
                     data: {
                         id,
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
                 break
             }
             case "products": {
                 this.ref = this.dialogService.open(ProductsFormComponent, {
                     header: 'Manage record ' + this.dataSource(),
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
                  break
             }
             case "categories": {
                 this.ref = this.dialogService.open(CategoriesFormComponent, {
                     header: 'Manage record ' + this.dataSource(),
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
                 break
             }
         }
     }

     //--------------------------------------------------------------------------------------------
     confirm(dataSource: string, id: number){

         this.confirmationService.confirm({
             message: "Se eliminará el registro" + "\n¿Desea continuar?" ,
             header: 'Información',
             closable: true,
             closeOnEscape: false,
             icon: 'pi pi-question-circle',
             rejectButtonProps: {
                 label: 'No, no lo elimines',
                 severity: 'secondary',
                 outlined: true,
             },
             acceptButtonProps: {
                 label: 'Si. Elimínalo por favor',
             },
             accept: () => {
                 setTimeout(function(){
                     console.log("Intentando eliminar el registro");
                 }, 3000)
                 this.deleteRecord(dataSource, id)

             },
             reject: () => {
                 this.messageService.add({
                     severity: 'error',
                     summary: 'Cancelado',
                     detail: 'Eliminación cancelada',
                     life: 3000,
                 })
             },
         })
     }

     //--------------------------------------------------------------------------------------------
     deleteRecord(dataSource: string, id: number){

         if(dataSource == 'categories'){

             this.categoriesService.deleteCategory(id).subscribe({
                 next:(response: boolean) => {

                     if (response){
                         this.messageService.add({ severity: 'info', summary: 'Confirmado', detail: 'Se eliminó el registro' });
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
             this.productsService.deleteProduct(id).subscribe({
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

     ngOnDestroy() {

         if (this.ref) {
             this.ref.close()
         }
     }

     //--------------------------------------------------------------------------------------------

 }
