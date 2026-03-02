import { Injectable } from "@angular/core";
import { CanActivate, Router, UrlTree } from "@angular/router";
// REturning a UrlTree allows the router to control navigation declaratively.
import { Auth } from "../services/auth";
// Guards do not read loacalStorage directly =  they ask AuthService.


@Injectable({
  providedIn: 'root',
})

export class AuthGuard implements CanActivate {
    constructor(private auth: Auth, private router: Router) {}

    canActivate(): boolean | UrlTree {
        if (this.auth.isLoggedIn()){
            return true;
        }
        return this.router.createUrlTree(['/login'])
    }

}
//Why cant we use router.navigate() instead of createUrlTree(['/'])
//because Guards should return navigation instructions, not trigger navigation directly.