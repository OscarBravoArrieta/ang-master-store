 import { LoadingService } from '@services/loading.service'
 import { Component, inject } from '@angular/core'
 import { PrimeNgModule } from '@import/primeng'

 @Component({
     selector: 'app-loading',
     imports: [PrimeNgModule],
     templateUrl: './loading.component.html',
     styleUrl: './loading.component.scss'
 })
 export class LoadingComponent {

     private readonly loadingService = inject(LoadingService)
     isLoading = this.loadingService.isLoading

     ngOnInit() {

         this.isLoading = this.loadingService.isLoading

     }


}
