 import { Component } from '@angular/core'
 import { PrimeNgModule } from '@import/primeng'
 import { RouterLinkWithHref } from '@angular/router'

 @Component({
     selector: 'app-unauthorized',
     imports: [
         PrimeNgModule,
         RouterLinkWithHref
     ],
     templateUrl: './unauthorized.component.html',
     styleUrl: './unauthorized.component.scss'
 })
 export class UnauthorizedComponent {

 }
