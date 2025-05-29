 import { HttpClient } from '@angular/common/http'
 import { Injectable, inject } from '@angular/core'
 import { Product } from '@model/products.model'
 import { environment } from '@environments/environment'


 @Injectable({
     providedIn: 'root'
 })
 export class ProductsService {
     private http = inject(HttpClient)
     private readonly endPoint = environment.API_URL

     constructor() { }
     //--------------------------------------------------------------------------------------------
     getProductsByCategory(category_id?: string) {
         const url = new URL(`https://api.escuelajs.co/api/v1/products`)
             if(category_id) {
             url.searchParams.set('categoryId', category_id)
         }

         return this.http.get<Product[]>(url.toString())
     }
     //--------------------------------------------------------------------------------------------
     getProducts() {

         return this.http.get<Product[]>(`${this.endPoint}/products`)
     }

     //--------------------------------------------------------------------------------------------
     deleteProduct(id: number){

         return this.http.delete<boolean>(`${this.endPoint}/products/${id}`)

     }
 }
