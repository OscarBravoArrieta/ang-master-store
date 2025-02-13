import { HeaderComponent } from '@layout/header/header.component';
 import { Component } from '@angular/core'
 import { RouterOutlet } from '@angular/router'

 @Component({
     selector: 'app-layout',
     imports: [
         RouterOutlet,
         HeaderComponent
     ],
     templateUrl: './layout.component.html',
     styleUrl: './layout.component.scss'
 })
 export class LayoutComponent {

 }
