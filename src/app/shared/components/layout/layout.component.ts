 import { Component } from '@angular/core'
 import { RouterOutlet } from '@angular/router'
 import { PrimeNgModule } from '@import/primeng'
 import { HeaderComponent } from '@layout/header/header.component';
 import { LoadingComponent } from '@layout/loading/loading.component';

 @Component({
     selector: 'app-layout',
     imports: [
         RouterOutlet,
         PrimeNgModule,
         HeaderComponent,
         LoadingComponent
     ],
     templateUrl: './layout.component.html',
     styleUrl: './layout.component.scss'
 })
 export class LayoutComponent {


 }
