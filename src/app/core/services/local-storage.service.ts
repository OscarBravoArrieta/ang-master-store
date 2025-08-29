import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }
     //--------------------------------------------------------------------------------------------

     setItem (key: string, value: any): void {
         try {

             localStorage.setItem(key, JSON.stringify(value))

         } catch (error) {

             console.error(`Error savin in localStorage ${key} ${error}`)

         }

      }

     //--------------------------------------------------------------------------------------------

     getItem(key: string) {

         let value = null

         try {

             if (typeof window !== 'undefined') {

                 const storage = localStorage.getItem(key) ? localStorage.getItem(key) : null
                 if (storage) {
                     value = JSON.parse(storage)
                     return value
                 }
                 return value

             }

         } catch (error) {

             console.error(`Error loading ${key} ${error}`)
             return null

         }

     }

     //--------------------------------------------------------------------------------------------

     removeItem(key: string) {

         try {

             localStorage.removeItem(key)

         } catch (error) {

             console.error(`Error removing ${key} ${error}`)

         }

     }

     //--------------------------------------------------------------------------------------------

     clearAllStorage() {

         localStorage.clear()
     }

     //--------------------------------------------------------------------------------------------
}
