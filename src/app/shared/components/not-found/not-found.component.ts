 import { Component } from '@angular/core'
 import { PrimeNgModule } from '@import/primeng'
 import { RouterLinkWithHref } from '@angular/router'

 @Component({
     selector: 'app-not-found',
     imports: [
         PrimeNgModule,
         RouterLinkWithHref
     ],
     templateUrl: './not-found.component.html',
     styleUrl: './not-found.component.scss'
 })
 export class NotFoundComponent {

 }
