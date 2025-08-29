 import { inject, Injectable } from '@angular/core'
 import { HttpClient, HttpHeaders } from '@angular/common/http'
 import * as XLSX from 'xlsx'
 import { saveAs } from 'file-saver'
 import { environment } from '@environments/environment.development';
 import { Observable } from 'rxjs';

 @Injectable({
     providedIn: 'root'
 })
 export class ExportService {

     private http = inject(HttpClient)
     private apiJson: string = environment.JSON_URL

     httpOptions = {
         headers: new HttpHeaders({
             'Content-Type':  'application/json; charset=utf-8',
             "Access-Control-Allow-Origin": "*",
         }
     ), responseType: 'text' as 'json'}

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

     readJson() {

         return this.http.get<any>(`${this.apiJson}`, this.httpOptions)

     }

     //--------------------------------------------------------------------------------------------
     uploadFile(file: Blob): Observable<any> {
         const form = new FormData()
         form.append('file', file)
         console.log('File recibido', file)
         const headers = new HttpHeaders().set("Content-Type", "application/json")
         return this.http.post(`${environment.UPLOAD_FILES}/`, file,  this.httpOptions)
     }
 }
