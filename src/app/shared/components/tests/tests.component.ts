 import { Component, inject, signal, SimpleChanges } from '@angular/core'
 import { CategoriesService } from 'app/core/services/categories.service'
 import { ProductsService } from 'app/core/services/products.service'
 import { Product } from '@models/products.model'
 import { PrimeNgModule } from '@import/primeng'
 import { SelectStringInterface } from '@models/common-models'
 import { Router, RouterModule } from '@angular/router'
//  import { ProductDetailsComponent } from '@dashboard/product-details/product-details.component'
 import { AuthService } from '@services/auth.service'
//  import { SearchProductPipe } from '@pipes/search-product.pipe'
 import { FormsModule } from '@angular/forms'
 import { CommonModule } from '@angular/common'

 @Component({
     selector: 'app-tests',
     imports: [
         PrimeNgModule,
         RouterModule,
         //ProductDetailsComponent,
         FormsModule,
         CommonModule,
         //SearchProductPipe
     ],
     templateUrl: './tests.component.html',
     styleUrl: './tests.component.scss'
 })
 export default class TestsComponent {
     private productService = inject(ProductsService)
     private categoriesService = inject(CategoriesService)
     readonly authService = inject(AuthService)
     products = signal<Product[]>([])
     categories = signal<SelectStringInterface[]>([])
     idCategory = signal<string>('')
     categoryName = signal<string>('')
     private router = inject(Router)
     searchValue: string = ''


     currentUserProfile = this.authService.currentUserProfile

     sidebarVisible = false;

     ngOnInit() {

         this.getCategories()
         this.getProducts()
         this.currentUserProfile = this.authService.currentUserProfile

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
                 console.log('Error obtainig Categories...', error.error.message)
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



