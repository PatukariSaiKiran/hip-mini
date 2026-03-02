import { Injectable } from "@angular/core";
import { 
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest,

 } from "@angular/common/http";
import { Auth } from "../services/auth";
import { Observable } from "rxjs";


 @Injectable()
 export class AuthInterceptor implements HttpInterceptor {
   constructor(private auth: Auth) {}
   
   /**
    * Purpose: runs for every Http request.
    * If token exists, attach: Authorizations: Bearer <token>
    * 
    */
    
   intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.auth.getToken();
     //if not logged in, forword request as-is.
    if(!token) {
        return next.handle(req);
       }
   



   //HttpRequest is immutable, so we "clone" and add headers.
   const authReq =  req.clone({
    setHeaders: {
        Authorization: `Bearer ${token}`,
    },
   });
   return next.handle(authReq)
 }
 }