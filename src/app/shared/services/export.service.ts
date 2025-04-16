 import { Injectable } from '@angular/core'
 import * as XLSX from 'xlsx'
 import { saveAs } from 'file-saver'

 @Injectable({
     providedIn: 'root'
 })
 export class ExportService {

     constructor() { }

     exportJsonToExcel(jsonData: any[], fileName: string): void {

         const workSheet  = XLSX.utils.json_to_sheet(jsonData); // Convert JSON to excel sheet

         const workBook: XLSX.WorkBook = {
             Sheets: { Datos: workSheet },
             SheetNames: ['Datos'],
         };
         const buffer = XLSX.write(workBook, { bookType: 'xlsx', type: 'array' })

         const blob = new Blob([buffer], { type: 'application/octet-stream' })
         saveAs(blob, `${fileName}.xlsx`) //Saving the file using FIleSaver
     }

     //--------------------------------------------------------------------------------------------

     processInChunks(jsonData: any[], chunkSize: number): any[][] {
         const chunks: any[][] = []
         for (let i = 0; i < jsonData.length; i += chunkSize) {
             chunks.push(jsonData.slice(i, i + chunkSize));
         }
         return chunks;
      }

     //--------------------------------------------------------------------------------------------
 }
