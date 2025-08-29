 import { HttpClient } from '@angular/common/http'
 import { Injectable, inject } from '@angular/core'
 import { Product, ProductToUpdate } from 'app/core/models/products.model'
 import { environment } from '@environments/environment'


 @Injectable({
     providedIn: 'root'
 })
 export class ProductsService {
     private http = inject(HttpClient)
     private readonly endPoint = environment.API_URL

     constructor() { }
     //--------------------------------------------------------------------------------------------
     getProductsByCategory(idCategory?: string) {

         const url = new URL(`https://api.escuelajs.co/api/v1/products`)
         if(idCategory) {
             url.searchParams.set('categoryId', idCategory)
         }

         return this.http.get<Product[]>(url.toString())

     }
     //--------------------------------------------------------------------------------------------
     getProducts() {

         return this.http.get<Product[]>(`${this.endPoint}/products`)
     }

     //--------------------------------------------------------------------------------------------

     getProduct(id: number) {

         return this.http.get<Product>(`${this.endPoint}/products/${id}`)

     }

     //--------------------------------------------------------------------------------------------
     createProduct(product: Product){

         return this.http.post<Product>(`${this.endPoint}/products/`, product)

     }

     //--------------------------------------------------------------------------------------------

     deleteProduct(id: number){

         return this.http.delete<boolean>(`${this.endPoint}/products/${id}`)

     }

     //--------------------------------------------------------------------------------------------
     updateProduct(id: number | undefined, data: ProductToUpdate) {

         return this.http.put<Product>(`${this.endPoint}/products/${id}`, data)

     }

     //--------------------------------------------------------------------------------------------

     async uploadAvatar(file: any){

         const formData = new FormData();
         formData.append("file", file);
         const response = await fetch(`${this.endPoint}/files/upload`, {
             method: "POST",
             body: formData,
         })

         return response.json()

     }

     //--------------------------------------------------------------------------------------------

 }
