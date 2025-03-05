 import { NgModule } from '@angular/core'
 import { CommonModule } from '@angular/common'
 import { InputTextModule } from 'primeng/inputtext'
 import { ButtonModule } from 'primeng/button'
 import { ImageModule } from 'primeng/image'
 import { Menu } from 'primeng/menu'
 import { MenuModule } from 'primeng/menu'
 import { DynamicDialogModule } from 'primeng/dynamicdialog'
 import { PasswordModule } from 'primeng/password'
 import { CardModule } from 'primeng/card'
 import { FieldsetModule } from 'primeng/fieldset'
 import { AvatarModule } from 'primeng/avatar'
 import { ToastModule } from 'primeng/toast'
 import { ConfirmDialogModule } from 'primeng/confirmdialog'

 @NgModule({
     declarations: [],
     imports: [
         CommonModule,
         ImageModule,
         InputTextModule,
         ButtonModule,
         Menu,
         MenuModule,
         DynamicDialogModule,
         PasswordModule,
         CardModule,
         FieldsetModule,
         AvatarModule,
         ToastModule,
         ConfirmDialogModule,

     ],
     exports: [
         ButtonModule,
         ImageModule,
         InputTextModule,
         Menu,
         MenuModule,
         DynamicDialogModule,
         PasswordModule,
         CardModule,
         FieldsetModule,
         AvatarModule,
         ToastModule,
         ConfirmDialogModule,

     ]
 })
 export class PrimeNgModule {}

