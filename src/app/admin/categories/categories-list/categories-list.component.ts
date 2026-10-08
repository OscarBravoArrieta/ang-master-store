
 import { Component, effect, inject, Injector, signal } from '@angular/core'
 import { CommonModule } from '@angular/common'
 import { PrimeNgModule } from '@import/primeng'
 import { CategoriesService } from 'app/core/services/categories.service'
 import { Category } from '@models/category.model'
 import { DataSchema } from 'app/core/models/data-schema.model'
 import { DataViewerTemplateComponent } from '@layout/data-viewer-template/data-viewer-template.component';
 import { EntityConfig } from '@models/entity-config.model'
 import { CategoriesFormComponent } from '@admin/categories/categories-form/categories-form.component'


 @Component({
     selector: 'app-categories-list',
     imports: [
         PrimeNgModule,
         CommonModule,
         DataViewerTemplateComponent
     ],
     templateUrl: './categories-list.component.html',
     styleUrl: './categories-list.component.scss'
 })
 export default class CategoriesListComponent {
     injector = inject(Injector)
     readonly categoriesService = inject (CategoriesService)
     dataSet = signal<Category[]>(this.categoriesService.categories())

     config: EntityConfig<Category> = {
         title: 'categories',
         form: CategoriesFormComponent,
         load: () => this.categoriesService.getCategories(),
         remove: (category) => this.categoriesService.deleteCategory(category.id!),
         describe: (category) => `la categoría: ${category.name}`,
         savedMsg: 'Categoría guardada',
     }
     cols = signal<DataSchema[]>([])

     constructor() {

     }

     //--------------------------------------------------------------------------------------------

     ngOnInit(){

         this.dataSet.set(this.categoriesService.categories())
         this.getCategories()

     }

     //-------------------------------------------------------------------------------------------

     getCategories() {

         this.categoriesService.getCategories().subscribe({
             next: (dataSet) => {
                 this.dataSet.set(dataSet)
                 this.getCols()
             }
         }, )
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
