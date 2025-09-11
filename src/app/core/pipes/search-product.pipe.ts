 import { Pipe, PipeTransform } from '@angular/core'
 import { Product } from '@models/products.model'

 @Pipe({
     name: 'searchProduct'
 })
 export class SearchProductPipe implements PipeTransform {

     transform(value: Product[], ...args: any): Product[] {

         if(args[0].length == 0 || args[0].length < 3) return value

         const resultProducts: Product[] = []

         for(const product of value) {
             if (product.title.toLowerCase().indexOf(args[0].toLowerCase()) > - 1) {

                 resultProducts.push(product)
             }
         }
         return resultProducts

     }

}
