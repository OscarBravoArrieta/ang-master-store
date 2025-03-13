 import { Component, input } from '@angular/core'
 import { CommonModule } from '@angular/common'
 import { PrimeNgModule } from '@import/primeng'

 @Component({
     selector: 'app-data-viewer-template',
     imports: [CommonModule, PrimeNgModule],
     templateUrl: './data-viewer-template.component.html',
     styleUrl: './data-viewer-template.component.scss'
 })
 export class DataViewerTemplateComponent {
     dataSource = input<any[]>([])
     cols = input<any[]>([])

 }
