 import { Component, inject } from '@angular/core'
 import { PrimeNgModule } from '@import/primeng'
 import { ExportService } from '@services/export.service'
 import { FileUpload } from 'primeng/fileupload'

 interface UploadEvent {
    originalEvent: Event;
    files: File[];
}


 @Component({
     selector: 'app-extract-from-json',
     imports: [PrimeNgModule, FileUpload],
     templateUrl: './extract-from-json.component.html',
     styleUrl: './extract-from-json.component.scss'
 })
 export default class ExtractFromJsonComponent {

     readonly exportService = inject(ExportService)
     filetype = "application/json"
     maxFileSize = 10000000
     contents: any = null
     filename: string = ''

     public onUpload(event: any) {
        console.log('Reading file...', event.files[0]);
        for (const file of event.files) {
          const dataset = this.readFile(file);
          console.log('onUpload: ', dataset);
        }

      }

      private readFile(file: File) {
        const reader: FileReader = new FileReader();
        console.log('Reader...', reader)
        reader.onload = () => {
            console.log('readFile: ', reader.result);
            this.contents = reader.result;
        };
        reader.readAsText(file);
        this.filename = file.name;
      }


     exportToExcel(): void {
        // Supongamos que tienes un JSON grande cargado
        const jsonData = [
            {
                "id": 1,
                "name": "Clothes",
                "slug": "clothes",
                "image": "https://i.imgur.com/QkIa5tT.jpeg",
                "creationAt": "2025-03-20T10:44:54.000Z",
                "updatedAt": "2025-03-20T23:20:08.000Z"
                },
                {
                "id": 2,
                "name": "Say My Name",
                "slug": "say-my-name",
                "image": "https://i.imgur.com/ZANVnHE.jpeg",
                "creationAt": "2025-03-20T10:44:54.000Z",
                "updatedAt": "2025-03-20T23:05:12.000Z"
                },
                {
                "id": 3,
                "name": "Furniture",
                "slug": "furniture",
                "image": "https://i.imgur.com/Qphac99.jpeg",
                "creationAt": "2025-03-20T10:44:54.000Z",
                "updatedAt": "2025-03-20T10:44:54.000Z"
                },
                {
                "id": 4,
                "name": "Shoes",
                "slug": "shoes",
                "image": "https://i.imgur.com/qNOjJje.jpeg",
                "creationAt": "2025-03-20T10:44:54.000Z",
                "updatedAt": "2025-03-20T10:44:54.000Z"
                },
                {
                "id": 5,
                "name": "Miscellaneous",
                "slug": "miscellaneous",
                "image": "https://i.imgur.com/BG8J0Fj.jpg",
                "creationAt": "2025-03-20T10:44:54.000Z",
                "updatedAt": "2025-03-20T10:44:54.000Z"
                },
                {
                "id": 8,
                "name": "Royal Items",
                "slug": "royal-items",
                "image": "https://i.imgur.com/49FiVI0.png",
                "creationAt": "2025-03-20T19:57:24.000Z",
                "updatedAt": "2025-03-20T19:57:24.000Z"
                },
                {
                "id": 17,
                "name": "Messi",
                "slug": "messi",
                "image": "https://api.escuelajs.co/api/v1/files/21af.jpg",
                "creationAt": "2025-03-20T23:01:15.000Z",
                "updatedAt": "2025-03-20T23:22:06.000Z"
                }
        ]
        this.exportService.exportJsonToExcel(jsonData, 'MiArchivoExcel')
     }

 }

// https://www.google.com/search?q=convertir+json+a+excel+desde+angular+19&oq=convertir+json+a+excel+desde+angular+19&gs_lcrp=EgZjaHJvbWUyBggAEEUYOTIHCAEQIRigAdIBCTE1MDY5ajBqN6gCALACAA&sourceid=chrome&ie=UTF-8
