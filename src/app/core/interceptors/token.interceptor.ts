
 import { HttpInterceptorFn } from '@angular/common/http'
 import { TokenService } from 'app/core/services/token.service'
 import { inject } from '@angular/core';

 export const tokenInterceptor: HttpInterceptorFn = (req, next) => {

     const token = inject(TokenService).getToken()
     const access_token: string | null = token ? token.access_token : null

     if(access_token){

         req = req.clone({
             headers: req.headers.set('Autorization', `Bearer ${access_token}` )
         })

     }

     return next(req)
 }
