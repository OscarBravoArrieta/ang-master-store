 import { Component, inject, input } from '@angular/core'
 import { CommonModule } from '@angular/common'
 import { PrimeNgModule } from '@import/primeng'
 import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog'
 import { UserFormComponent } from '@admin/users/user-form/user-form.component'
 import { ProductsFormComponent } from '@admin/products/products-form/products-form.component'
 import { CategoriesFormComponent } from '@admin/categories/categories-form/categories-form.component'

 @Component({
     selector: 'app-data-viewer-template',
     imports: [
         CommonModule,
         PrimeNgModule,
     ],
     providers: [
         DialogService
     ],
     templateUrl: './data-viewer-template.component.html',
     styleUrl: './data-viewer-template.component.scss'
 })
 export class DataViewerTemplateComponent {

     private dialogService = inject(DialogService)
     dataSet = input<any[]>([])
     dataSource = input<string>('')
     cols = input<any[]>([])
     ref: DynamicDialogRef | undefined

     //--------------------------------------------------------------------------------------------

     callDialog(id = null, mode: string){

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
                         id: id
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
                         id: id
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
     ngOnDestroy() {

         if (this.ref) {
             this.ref.close()
         }
     }

     //--------------------------------------------------------------------------------------------

 }
