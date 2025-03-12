 import { Component, inject, signal } from '@angular/core'
 import { CommonModule } from '@angular/common'
 import { Toolbar } from 'primeng/toolbar'
 import { UsersService } from '@services/users.service'
 import { PrimeNgModule } from '@import/primeng'
 import { User, ColUser } from '@model/users.model'

 @Component({
     selector: 'app-users-list',
     imports: [PrimeNgModule, CommonModule, Toolbar ],
     templateUrl: './users-list.component.html',
     styleUrl: './users-list.component.scss'
 })
 export default class UsersListComponent {

     readonly userService = inject (UsersService)
     dataSource = signal<User[]>([])
     cols = signal<ColUser[]>([])

     //--------------------------------------------------------------------------------------------

     ngOnInit(){

         this.getUsers()
     }
     //--------------------------------------------------------------------------------------------

     getUsers() {

         this.userService.getUsers().subscribe({
             next: (dataSource) => {

                 this.dataSource.set(dataSource)
                 this.getCols()

             }, error: (error) => {

                 console.log(error)
             }
         })

     }

     //--------------------------------------------------------------------------------------------

     getCols():void{

         this.cols.set([

             {field: 'id', header: 'Id', sortableColumnDisabled: false},
             {field: 'name', header: 'Name', sortableColumnDisabled: false},
             {field: 'role', header: 'Role', sortableColumnDisabled: false},
             {field: 'email', header: 'Email', sortableColumnDisabled: false},
             {field: 'avatar', header: 'Avatar', sortableColumnDisabled: true},
             {field: 'creationAt', header: 'Creation Date', sortableColumnDisabled: false},
             {field: 'updatedAt', header: 'Update Date', sortableColumnDisabled: false},

         ])
     }

 }
