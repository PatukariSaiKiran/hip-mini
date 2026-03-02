import { Injectable } from "@angular/core";
import { CanActivate, Router, UrlTree } from "@angular/router";
import { Auth } from "../services/auth";


@Injectable({
    providedIn: 'root',
})

export class RoleGuard implements CanActivate {
    constructor(private auth: Auth, private router: Router) {}

    canActivate(): boolean | UrlTree {

     /**
      * Purpose: protect admin-only routes.
      * rule:
      * 1) Must be logged in
      * 2) Must have role ADMIN
      */
        if(!this.auth.isLoggedIn()) {
            return this.router.createUrlTree(['/login'])
        }
        
        const role = this.auth.getCurrentRole();
        if(role === 'ADMIN'){
            return true;
        }
        //If logged in but not admin -> send to normal page (or / 403 later)
        return this.router.createUrlTree(['/app/manage-apis']);
    }
}