 import { Component, inject, signal } from '@angular/core'
 import { CommonModule } from '@angular/common'
 import { PrimeNgModule } from '@import/primeng'
 import { Toolbar } from 'primeng/toolbar'
 import { CategoriesService } from '@services/categories.service'
 import { Category } from '@model/category.model'
 import { DataSchema } from '@model/data-schema.model'
 import { DataViewerTemplateComponent } from '@layout/data-viewer-template/data-viewer-template.component'


 @Component({
     selector: 'app-categories-list',
     imports: [PrimeNgModule, CommonModule, Toolbar, DataViewerTemplateComponent],
     templateUrl: './categories-list.component.html',
     styleUrl: './categories-list.component.scss'
 })
 export default class CategoriesListComponent {
     readonly categoriesService = inject (CategoriesService)
     dataSource = signal<Category[]>([])
     cols = signal<DataSchema[]>([])

     //--------------------------------------------------------------------------------------------

     ngOnInit(){

         this.getCategories()
     }

     //--------------------------------------------------------------------------------------------

     getCategories() {

         this.categoriesService.getCategories().subscribe({
             next: (datasource) => {
                 this.dataSource.set(datasource)
                 this.getCols()

             }
         })
     }

     //--------------------------------------------------------------------------------------------

     getCols():void{

         this.cols.set([

             {field: 'id', header: 'Id', sortableColumnDisabled: false, contentType: 'string' },
             {field: 'name', header: 'Name', sortableColumnDisabled: false, contentType: 'string' },
             {field: 'image', header: 'Image', sortableColumnDisabled: true, contentType: 'image' },

         ])
     }

 }
