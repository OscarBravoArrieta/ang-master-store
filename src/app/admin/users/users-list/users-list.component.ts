 import { Component, inject, signal, SimpleChanges } from '@angular/core'
 import { CommonModule } from '@angular/common'
 import { PrimeNgModule } from '@import/primeng'
 import { UsersService } from 'app/core/services/users.service'
 import { User } from 'app/core/models/users.model'
 import { DataSchema } from 'app/core/models/data-schema.model'
 import { DataViewerTemplateComponent } from '@layout/data-viewer-template/data-viewer-template.component'

 @Component({
     selector: 'app-users-list',
     imports: [PrimeNgModule, CommonModule, DataViewerTemplateComponent ],
     templateUrl: './users-list.component.html',
     styleUrl: './users-list.component.scss'
 })
 export default class UsersListComponent {

     readonly userService = inject (UsersService)
     dataSet = signal<User[]>([])
     dataSource = signal<string>('users')
     cols = signal<DataSchema[]>([])

     //--------------------------------------------------------------------------------------------

     ngOnInit(){

         this.getUsers()

     }
     //--------------------------------------------------------------------------------------------

     getUsers() {

         this.userService.getUsers().subscribe({
             next: (dataSet) => {

                 this.dataSet.set(dataSet)
                 this.getCols()

             }, error: (error) => {

                 console.log(error)
             }
         })

     }

     //--------------------------------------------------------------------------------------------

     getCols():void{

         this.cols.set([

             {field: 'id', header: 'Id', sortableColumnDisabled: false, contentType: 'number' },
             {field: 'name', header: 'Name', sortableColumnDisabled: false, contentType: 'string' },
             {field: 'role', header: 'Role', sortableColumnDisabled: false, contentType: 'string' },
             {field: 'email', header: 'Email', sortableColumnDisabled: false, contentType: 'string' },
             {field: 'avatar', header: 'Avatar', sortableColumnDisabled: true, contentType: 'image-avatar' },
             {field: 'creationAt', header: 'Creation Date', sortableColumnDisabled: false, contentType: 'string' },
             {field: 'updatedAt', header: 'Update Date', sortableColumnDisabled: false, contentType: 'string' },

         ])
     }

 }
