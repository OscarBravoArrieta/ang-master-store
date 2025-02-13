 import { Component } from '@angular/core'
import { RouterLink } from '@angular/router'
 import { PrimeNgModule } from '@import/primeng'


 @Component({
     selector: 'app-header',
     imports: [
         PrimeNgModule,
         RouterLink
     ],
     templateUrl: './header.component.html',
     styleUrl: './header.component.scss'
})
export class HeaderComponent {

}
