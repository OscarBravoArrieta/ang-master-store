 import { HttpClient } from '@angular/common/http'
 import { Injectable, inject, signal } from '@angular/core'
 import { Category } from 'app/core/models/category.model'
 import { environment } from '@environments/environment'
 import { tap } from 'rxjs'


 @Injectable({
     providedIn: 'root'
 })
 export class CategoriesService {

     private http = inject(HttpClient)
     private readonly endPoint = environment.API_URL

     categories = signal<Category[]>([])

     constructor() { }

    //--------------------------------------------------------------------------------------------
     getCategories() {

         return this.http.get<Category[]>(`${this.endPoint}/categories`).pipe(
             tap(categories => {
                 this.categories.set(categories)
             })
         )

     }

     //--------------------------------------------------------------------------------------------

     getCategorie(id: number){

         return this.http.get<Category>(`${this.endPoint}/categories/${id}`)

     }

     //--------------------------------------------------------------------------------------------

     createCategory(category: Category){

         return this.http.post<Category>(`${this.endPoint}/categories/`, category)

     }

     //--------------------------------------------------------------------------------------------

     updateCategory(id: number | undefined, data: Category) {

         return this.http.put<Category>(`${this.endPoint}/categories/${id}`, data)

     }

     //--------------------------------------------------------------------------------------------

     deleteCategory(id: number) {

         return this.http.delete<boolean>(`${this.endPoint}/categories/${id}`)
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

 }
