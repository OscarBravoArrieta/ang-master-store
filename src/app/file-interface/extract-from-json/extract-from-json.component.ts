 import { Component, inject } from '@angular/core'
 import { PrimeNgModule } from '@import/primeng'
 import { ExportService } from '@services/export.service'
 import { FileUpload } from 'primeng/fileupload'
 import { MessageService } from 'primeng/api'

 @Component({
     selector: 'app-extract-from-json',
     imports: [PrimeNgModule, FileUpload],
     templateUrl: './extract-from-json.component.html',
     styleUrl: './extract-from-json.component.scss',
     providers: [MessageService]
 })
 export default class ExtractFromJsonComponent {

     readonly exportService = inject(ExportService)
     readonly messageService = inject(MessageService)
     contents: any
     filename: string = ''
     jsonData: any

     onUpload(event: any) {
         const file = event.currentFiles[0]
         this.readFile(file)
         this.messageService.add({severity: 'info', summary: 'Procesando...', detail: ''})
     }

     //--------------------------------------------------------------------------------------------

     readFile(file: File) {
         try {
             const reader: FileReader = new FileReader()
             reader.onload = async () => {

                 this.contents = reader.result
                 this.jsonData = JSON.parse(this.contents)
                 this.forEachJson()
             }
             reader.readAsText(file)
             this.filename = file.name

         } catch (error) {

             this.messageService.add({severity: 'info', summary: 'Error', detail: ''})

         }

     }

     //--------------------------------------------------------------------------------------------

     readJson(){

         this.exportService.readJson().subscribe({
             next: (res) => {
                 this.jsonData = JSON.parse(res)
                 this.forEachJson()
             }, error: (error) => {
                 console.log('Error al leer el archivo...',error)
             }
         })

     }

     //--------------------------------------------------------------------------------------------

     forEachJson() {

         let users: any = []
         let queries: any = []
         let procedures: any = []
         let medications: any = []
         let otherServices: any = []
         let fileDate = new Date().toISOString()

         Object.entries(this.jsonData.usuarios).forEach(([key, value]) => {

             const currentQueries = this.jsonData.usuarios[key].servicios.consultas
             const currentProcedures = this.jsonData.usuarios[key].servicios.procedimientos
             const currentMedications = this.jsonData.usuarios[key].servicios.medicamentos
             const currentOtherServices = this.jsonData.usuarios[key].servicios.otrosServicios

             users.push(value)

             this.pushServices(currentQueries, queries)
             this.pushServices(currentProcedures, procedures)
             this.pushServices(currentMedications, medications)
             this.pushServices(currentOtherServices, otherServices)

         })

         this.exportService.exportJsonToExcel(users, 'Usuarios-' + fileDate)
         this.exportService.exportJsonToExcel(procedures, 'Procedimientos-' + fileDate)
         this.exportService.exportJsonToExcel(queries, 'Consultas-' + fileDate)
         this.exportService.exportJsonToExcel(medications, 'Medicamentos-' + fileDate)
         this.exportService.exportJsonToExcel(otherServices, 'OtrosServicios-' + fileDate)

         return true


     }
     //--------------------------------------------------------------------------------------------

     pushServices(service: any, objectArray: any) {
         if(service) {
             Object.entries(service).forEach(([k, v]) => {
                 objectArray.push(v)
             })
         }
     }

     //--------------------------------------------------------------------------------------------

     //https://stackoverflow.com/questions/52292488/upload-file-with-primeng-upload-component
     //https://stackoverflow.com/questions/50335329/p-fileupload-how-to-read-file-after-upload
     //https://platzi.com/cursos/angular-apis/subida-de-archivos-con-http/


 }
