 import { computed, effect, inject, Injectable, Injector, signal } from '@angular/core'
 import { LocalStorageService } from './local-storage.service'
 import { Product } from '@model/products.model'

 @Injectable({
     providedIn: 'root'
 })
 export class CartService {

     injector = inject(Injector)
     private localStorageService = inject(LocalStorageService)
     cart = signal<Product[]>([])
     total = computed(() => {
         const cart = this.cart()
     })

     constructor() {

         const productsSaved = this.localStorageService.getItem('productsInCart')

         if(productsSaved) {

             this.cart.set(productsSaved)

         }


     }

     //--------------------------------------------------------------------------------------------
     synchronizeLocalStorage(){

         effect (() => {

             const productsInCart = this.cart()
             this.localStorageService.setItem('productsInCart', productsInCart)
         }, { injector: this.injector })

     }
     //--------------------------------------------------------------------------------------------
     addToCart(product: Product){

         const currentProducts = this.cart()
         const existingProductIndex = currentProducts.findIndex((p: Product) => p.id === product.id)
         const quantity = product?.quantity || 1

         if (existingProductIndex >= 0) {
             currentProducts[existingProductIndex] = {
                 ...product,
                 quantity: (currentProducts[existingProductIndex].quantity || 0) + quantity,
             }
             this.cart.set(currentProducts)
             console.log(currentProducts[existingProductIndex])

         } else {
             this.cart.update((products: Product[])=>[
                     ...products,
                     {...product, quantity: quantity}
                 ]
             )

         }

         this.synchronizeLocalStorage()

     }

     //--------------------------------------------------------------------------------------------



 }
