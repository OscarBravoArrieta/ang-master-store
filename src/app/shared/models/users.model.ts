 export interface User {
     id?: number,
     email: string
     name: string
     password: string
     role?: string
     avatar?: string

 }
 export interface UserToUpdate {
     email: string
     name: string
 }

 export interface ColUser {
    field: string
    header: string
    sortableColumnDisabled: boolean
 }

 export interface UserToLog {
     email: string
     password: string
 }

 export interface Email{
     email: string
 }

 export interface EmailIsAvailable {

     isAvailable: boolean

 }

 export interface Token {

     access_token:  string
     refresh_token:  string

 }
