 import { Component, inject, signal } from '@angular/core'
 import { CommonModule } from '@angular/common'
 import { PrimeNgModule } from '@import/primeng'
 import { CategoriesService } from 'app/core/services/categories.service'
 import { Category } from '@models/category.model'
 import { DataSchema } from 'app/core/models/data-schema.model'
 import { DataViewerTemplateComponent } from '@layout/data-viewer-template/data-viewer-template.component'

 @Component({
     selector: 'app-categories-list',
     imports: [PrimeNgModule, CommonModule, DataViewerTemplateComponent],
     templateUrl: './categories-list.component.html',
     styleUrl: './categories-list.component.scss'
 })
 export default class CategoriesListComponent {
     readonly categoriesService = inject (CategoriesService)
     dataSet = signal<Category[]>([])
     dataSource = signal<string>('categories')
     cols = signal<DataSchema[]>([])

     //--------------------------------------------------------------------------------------------

     ngOnInit(){

         this.getCategories()
     }

     //--------------------------------------------------------------------------------------------

     getCategories() {

         this.categoriesService.getCategories().subscribe({
             next: (dataSet) => {
                 this.dataSet.set(dataSet)
                 this.getCols()

             }
         })
     }

     //--------------------------------------------------------------------------------------------

     getCols():void{

         this.cols.set([

             {field: 'id', header: 'Id', sortableColumnDisabled: false, contentType: 'string' },
             {field: 'name', header: 'Name', sortableColumnDisabled: false, contentType: 'string' },
             {field: 'image', header: 'Image', sortableColumnDisabled: true, contentType: 'image' }

         ])
     }

 }
