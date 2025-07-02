 import { Component, inject, signal, SimpleChanges } from '@angular/core'
 import { CategoriesService } from '@services/categories.service'
 import { ProductsService } from '@services/products.service'
 import { Product } from '@model/products.model'
 import { PrimeNgModule } from '@import/primeng'
 import { SelectStringInterface } from '@model/common-models'
 import { Router, RouterModule } from '@angular/router'
 import { ProductDetailsComponent } from '@dashboard/product-details/product-details.component'

 @Component({
     selector: 'app-dashboard',
     imports: [
         PrimeNgModule,
         RouterModule,
         ProductDetailsComponent
     ],
     templateUrl: './dashboard.component.html',
     styleUrl: './dashboard.component.scss'
 })
 export default class DashboardComponent {

     private productService = inject(ProductsService)
     private categoriesService = inject(CategoriesService)
     products = signal<Product[]>([])
     categories = signal<SelectStringInterface[]>([])
     idCategory = signal<string>('')
     categoryName = signal<string>('')
     private router = inject(Router)

     condicion = false

     //--------------------------------------------------------------------------------------------

     ngOnInit() {

         this.getCategories()
         this.getProducts()


     }

     //--------------------------------------------------------------------------------------------
     ngOnChanges(changes: SimpleChanges) {

         this.getProducts()

     }

     //--------------------------------------------------------------------------------------------
     getCategories() {

         this.categoriesService.getCategories().subscribe( {
             next: (categories) => {
                 this.categories.set(categories
                     .map(category => ({
                         name: category.name,
                         value: String(category.id)
                     })
                 ))

                 this.categories.update(current => [
                     { name: 'Todas', value: '' }, ...current
                 ])
             }, error: (error: any) => {
                 console.log('Error obtainig Categorias...', error.error.message)
             }
         })

     }

     //--------------------------------------------------------------------------------------------

     getProducts() {

         this.productService.getProductsByCategory(this.idCategory()).subscribe({
             next: (products) => {
                 this.products.set(products)
             }, error: (error: any) => {
                 console.log('Error obtainig products...', error.error.message)
             }
         })

     }

     //--------------------------------------------------------------------------------------------
     selectCategorie(event: any){


         this.idCategory.set(event.option.value)
         this.categoryName.set(event.option.name)

         if(event.option.value) {

             this.router.navigate(['dashboard'], { queryParams: { idCategory: this.idCategory() } })

         } else {

             this.router.navigate(['dashboard'])

         }
         this.getProducts()

     }

     //--------------------------------------------------------------------------------------------



 }
