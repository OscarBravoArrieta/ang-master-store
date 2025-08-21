 import { Component, inject, signal } from '@angular/core'
 import { CommonModule } from '@angular/common'
 import { PrimeNgModule } from '@import/primeng'
 import { ProductsService } from '@services/products.service'
 import { Product } from '@model/products.model'
 import { DataSchema } from '@model/data-schema.model'
 import { DataViewerTemplateComponent } from '@layout/data-viewer-template/data-viewer-template.component'


 @Component({
     selector: 'app-products-list',
     imports: [PrimeNgModule, CommonModule, DataViewerTemplateComponent],
     templateUrl: './products-list.component.html',
     styleUrl: './products-list.component.scss'
 })
 export default class ProductsListComponent {

     readonly productsService = inject (ProductsService)
     dataSet = signal<Product[]>([])
     dataSource = signal<string>('products')
     cols = signal<DataSchema[]>([])

     //--------------------------------------------------------------------------------------------

     ngOnInit(){

         this.getProducts()
     }

     //--------------------------------------------------------------------------------------------

     ngOnChanges(){

         this.getProducts()

     }

     //--------------------------------------------------------------------------------------------

     getProducts() {

         this.productsService.getProducts().subscribe({
             next: (dataSet) => {
                 this.dataSet.set(dataSet)
                 this.getCols()

             }
         })

     }

     //--------------------------------------------------------------------------------------------


     getCols():void{

         this.cols.set([

             {field: 'id', header: 'Id', sortableColumnDisabled: false, contentType: 'number' },
             {field: 'title', header: 'Name', sortableColumnDisabled: false, contentType: 'string' },
             {field: 'price', header: 'Price', sortableColumnDisabled: false, contentType: 'currency' },
             {field: 'category', header: 'Category', sortableColumnDisabled: true, contentType: 'object' },
             {field: 'images', header: 'Image', sortableColumnDisabled: true, contentType: 'image-array' },
             {field: 'creationAt', header: 'Creation Date', sortableColumnDisabled: false, contentType: 'string' },
             {field: 'updatedAt', header: 'Update Date', sortableColumnDisabled: false, contentType: 'string' },

         ])
     }

 }
