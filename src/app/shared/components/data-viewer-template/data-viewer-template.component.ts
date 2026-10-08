
 import { Component, inject, input, signal, effect } from '@angular/core'
 import { CommonModule } from '@angular/common'
 import { PrimeNgModule } from '@import/primeng'
 import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog'
 import { ConfirmationService, MessageService  } from 'primeng/api'
 import { ExportService } from '@services/export.service'
 import { EntityConfig } from '@models/entity-config.model'

 @Component({
     selector: 'app-data-viewer-template',
     imports: [
         CommonModule,
         PrimeNgModule,
     ],
     providers: [
         DialogService,
         ConfirmationService,
         MessageService
     ],
     templateUrl: './data-viewer-template.component.html',
     styleUrl: './data-viewer-template.component.scss'
 })
 export class DataViewerTemplateComponent {

     private dialogService = inject(DialogService)
     readonly confirmationService = inject(ConfirmationService)
     readonly messageService = inject(MessageService)
     private exportService = inject(ExportService)
     dataSet = input<any[]>([])
     config = input.required<EntityConfig>()
     data = signal<any[]>([])

     isDisabled = signal<boolean>(this.dataSet().length === 0 ?  true: false)
     cols = input<any[]>([])
     ref: DynamicDialogRef | undefined

     private baseDialog: DynamicDialogConfig = {
         width: '30vw',
         closeOnEscape: false,
         contentStyle: { overflow: 'auto' },
         closable: true,
         draggable: true,
         modal: true,
         breakpoints: {
             '960px': '75vw',
             '640px': '90vw'
         },
     }

     constructor() {

         effect(() => {
             this.data.set([...this.dataSet()]) //synchronize the internal signal with the input
         })
     }

     //--------------------------------------------------------------------------------------------

     ngOnChanges(){

         this.isDisabled.set(this.dataSet().length === 0 ?  true: false)

     }

     //--------------------------------------------------------------------------------------------

     callDialog(id = null, mode: string) {

         const config = this.config()

         this.ref = this.dialogService.open(config.form, {
             ...this.baseDialog,
             header: 'Gestionando ' + config.title,
             ...config.dialog,
             data: {
                 id,
                 mode
             },
         })
         this.ref.onClose.subscribe((record: unknown) => {
             if (record) {
                 this.reload(config.savedMsg)
             }
         })
     }

     //--------------------------------------------------------------------------------------------
     confirm(rowData: any){

         const item: string = this.config().describe?.(rowData) ?? 'el registro'

         this.confirmationService.confirm({
             message: `Se eliminará ${item}. ¿Desea continuar?` ,
             header: 'Confirmación',
             closable: true,
             closeOnEscape: false,
             icon: 'pi pi-question-circle',
             rejectButtonProps: {
                 label: 'No, no lo elimines',
                 severity: 'secondary',
                 outlined: true,
             },
             acceptButtonProps: {
                 label: 'Si, continua por favor',
             },
             accept: () => {
                 this.deleteRecord(rowData)

             },
             reject: () => {
                 this.messageService.add({
                     severity: 'error',
                     summary: 'Cancelado',
                     detail: 'Eliminación declinada',
                     life: 3000,
                 })
             },
         })
     }

     //--------------------------------------------------------------------------------------------

     confirmPopUp(event: Event){
       this.confirmationService.confirm({
            target: event.target as EventTarget,
            message: 'Are you sure you want to proceed?',
            icon: 'pi pi-exclamation-triangle',
            rejectButtonProps: {
                label: 'Cancel',
                severity: 'secondary',
                outlined: true
            },
            acceptButtonProps: {
                label: 'Save'
            },
            accept: () => {
                this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'You have accepted', life: 3000 });
            },
            reject: () => {
                this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
            }
        })

     }
     //--------------------------------------------------------------------------------------------
     deleteRecord(rowData: any){

         this.config().remove!(rowData).subscribe({
             next: (response: boolean) => {
                 if (response) {
                     this.reload('Se eliminó el registro')
                 }
             }, error: (error: any) => {
                 this.messageService.add({
                     severity: 'error',
                     summary: 'Error',
                     detail: 'Error: ' + error.statusText,
                     life: 3000,
                 })
             }
         })
     }

     //--------------------------------------------------------------------------------------------

     private reload(detail: string) {

         this.config().load().subscribe({
             next: (newData) => {
                 this.data.set(newData)
                 this.messageService.add({
                     severity: 'success',
                     summary: detail,
                     detail: ''
                 })
             }
         })
     }

     //--------------------------------------------------------------------------------------------

     export(){

         let fileDate = new Date().toISOString()
         this.exportService.exportJsonToExcel(this.dataSet(), this.config().title + '-' + fileDate)

     }

     //--------------------------------------------------------------------------------------------

     ngOnDestroy() {

         if (this.ref) {
             this.ref.close()
         }

     }

     //--------------------------------------------------------------------------------------------

 }
