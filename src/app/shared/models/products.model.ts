 import { Category } from "@model/category.model"

 export interface Product {

     id?: number,
     title: string
     price: number
     description: string
     categoryId?: number
     category?: Category
     images: string[]
     slug?: string
     creationAt?: string
     updatedAt?: string

 }

 export interface ProductToUpdate {

     title: string
     price: number

 }

