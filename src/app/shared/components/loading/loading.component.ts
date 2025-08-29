 import { LoadingService } from 'app/core/services/loading.service'
 import { Component, inject } from '@angular/core'
 import { PrimeNgModule } from '@import/primeng'

 @Component({
     selector: 'app-loading',
     imports: [PrimeNgModule],
     templateUrl: './loading.component.html',
     styleUrl: './loading.component.scss'
 })
 export class LoadingComponent {

     isLoading = inject(LoadingService).isLoading

}
