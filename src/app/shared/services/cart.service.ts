 import { computed, effect, inject, Injectable, Injector, signal } from '@angular/core'
 import { LocalStorageService } from '@services/local-storage.service'
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
         return cart.reduce((total, product) => total + product.price, 0)
     })

     counProducts = computed(() => {
         const cart = this.cart()
         return cart.reduce((count, item) => count + (item.quantity || 1), 0);
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

     delete(productId: number | undefined){

         if(!productId) {
             this.cart.set([])
         }

         const currentProducts = this.cart()
         const productExists = currentProducts.some((product: Product) => product.id === productId)

         this.cart.update((products: Product[]) =>
             products.filter((product: Product) => product.id != productId)
         )

         this.synchronizeLocalStorage()

     }

 }
